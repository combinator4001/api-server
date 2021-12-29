import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InvestService } from './invest.service';
import { CreateInvestDto } from './dto/create-invest.dto';
import { UpdateInvestDto } from './dto/update-invest.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
    description: "Person invests in a company."
  })
  @ApiCreatedResponse({description: 'Invested successfully!'})
  @ApiBadRequestResponse({description: "Company not found! | Username is not for a company! | Already invested!"})
  @ApiUnauthorizedResponse({description: "Unauthorized! | Only person users can invest!"})
  async create(@Body() createInvestDto: CreateInvestDto, @Req() req) {
    //validation
    if(req.user.role !== Role.PERSON){
      throw new UnauthorizedException("Only person users can invest!");
    }
    const company = await this.prisma.user.findUnique({
      where: {
        username: createInvestDto.companyUsername
      }
    });
    if(!company){
      throw new BadRequestException("Company not found!");
    }
    if(company.role !== Role.COMPANY){
      throw new BadRequestException("Username is not for a company!");
    }

    try{
      await this.investService.makeInvest(
        req.user.id,
        req.user.username,
        company.id,
        company.email,
        createInvestDto.blogTitle,
        createInvestDto.money
      );
      
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Invested successfully!'
      };
    }catch{
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Already invested!"
      }
    }
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
