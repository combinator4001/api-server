import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadRequestException, HttpStatus, Put, ParseIntPipe, Query } from '@nestjs/common';
import { InvestService } from './invest.service';
import { CreateInvestDto } from './dto/create-invest.dto';
import { UpdateInvestDto } from './dto/update-invest.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/app/prisma.service';
import { GetInvest } from './dto/get-invest.dto';

@ApiTags('Invest')
@Controller()
export class InvestController {
  constructor(
    private readonly investService: InvestService,
    private prisma: PrismaService
  ) {}

  @Post('invest')
  @UseGuards(JwtAuthGuard)
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({
    summary: "New invest",
    description: "Person invests in a company."
  })
  @ApiCreatedResponse({description: 'Invested successfully!'})
  @ApiBadRequestResponse({description: "Company not found! | Username is not for a company! | Already invested!"})
  @ApiUnauthorizedResponse({description: "Unauthorized! | Only person users can invest!"})
  async newInvest(@Body() createInvestDto: CreateInvestDto, @Req() req) {
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
      throw new BadRequestException("Already invested!");
    }
  }

  @Get('invests')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Invest messages",
    description: "Use for inbox or sent invest messages."
  })
  @ApiOkResponse({
    type: GetInvest,
    isArray: true
  })
  @ApiBadRequestResponse({description: "Page and limit must be positive."})
  async getAllInvests(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Req() req
  ) {
    //validation page and limit
    if(page <= 0 || limit <= 0){
      throw new BadRequestException('page and limit must be positive!');
    }

    if(req.user.role === Role.ADMIN){
      throw new BadRequestException("Use admin panel apis!");
    }
    else if(req.user.role === Role.COMPANY){
      const queryResults = await this.investService.inboxCompany(
        page,
        limit,
        req.user.id
      );

      const results = queryResults.map(item => {
        const sender = item.person.user.username;
        const receiver = item.company.user.username;
        return new GetInvest(
          `${sender} wants to invest in your company!`,
          item.message,
          item.state,
          item.money,
          sender,
          receiver
        );
      });

      return results;
    }
    else{
      //person user
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInvestDto: UpdateInvestDto) {
    return this.investService.update(+id, updateInvestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investService.remove(+id);
  }
}
