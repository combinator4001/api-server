import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InvestService } from './invest.service';
import { CreateInvestDto } from './dto/create-invest.dto';
import { UpdateInvestDto } from './dto/update-invest.dto';
import { ApiBadRequestResponse, ApiHeader, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/app/prisma.service';

@ApiTags('Invest')
@Controller('invest')
export class InvestController {
  constructor(
    private readonly investService: InvestService,
    private prisma: PrismaService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({
    summary: "New invest",
    description: "Person invests on a company."
  })
  @ApiBadRequestResponse({description: "Company not found! | Username is not for a company!"})
  @ApiUnauthorizedResponse({description: "Only person users can invest!"})
  async create(@Body() createInvestDto: CreateInvestDto, @Req() req) {
    //validation
    if(req.user.role !== Role.PERSON){
      throw new UnauthorizedException("Only person users can invest!");
    }
    const user = await this.prisma.user.findUnique({
      where: {
        username: createInvestDto.companyUsername
      }
    });
    if(!user){
      throw new BadRequestException("Company not found!");
    }
    if(user.role !== Role.COMPANY){
      throw new BadRequestException("Username is not for a company!");
    }

    // return this.investService.create(createInvestDto);
  }

  @Get()
  findAll() {
    return this.investService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestDto: UpdateInvestDto) {
    return this.investService.update(+id, updateInvestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investService.remove(+id);
  }
}
