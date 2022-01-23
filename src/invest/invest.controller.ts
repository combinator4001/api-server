import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadRequestException, HttpStatus, Put, ParseIntPipe, Query } from '@nestjs/common';
import { InvestService } from './invest.service';
import { CreateInvestDto } from './dto/create-invest.dto';
import { UpdateInvestDto } from './dto/update-invest.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { InvestState, Role } from '@prisma/client';
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
  @ApiBadRequestResponse({
    description: 
      `\n
      Company not found!\n
      Username is not for a company!\n
      Already invested!\n
      `
  })
  @ApiUnauthorizedResponse({
    description: 
      `\n
      Unauthorized!\n
      Only person users can invest!\n
      `
  })
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
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({
    summary: "Invest messages",
    description: "Use for inbox or sent invest messages."
  })
  @ApiOkResponse({
    type: GetInvest,
    isArray: true
  })
  @ApiBadRequestResponse({description: "Page and limit must be positive."})
  @ApiUnauthorizedResponse({description: "Unauthorized!"})
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
          item.id,
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
      const queryResults = await this.investService.sentPerson(
        page,
        limit,
        req.user.id
      );

      const results = queryResults.map(item => {
        const sender = item.person.user.username;
        const receiver = item.company.user.username;
        return new GetInvest(
          item.id,
          `Investment in ${receiver}`,
          item.message,
          item.state,
          item.money,
          sender,
          receiver
        );
      });

      return results;
    }
  }

  @Put('invest/:id')
  @UseGuards(JwtAuthGuard)
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({summary: "Accept or reject an invest"})
  @ApiOkResponse({description: "status updated!"})
  @ApiBadRequestResponse({
    description: 
      `\n
      Invalid fields!\n
      There is no invest with this id!\n
      This invest is not in a pending state!\n
      `
  })
  @ApiUnauthorizedResponse({
    description: 
      `\n
      Unauthorized!\n
      Only companies can change the state of an invest!\n
      `
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvestDto: UpdateInvestDto,
    @Req() req
  ) {

    if(req.user.role !== Role.COMPANY){
      throw new UnauthorizedException("Only companies can change the state of an invest!");
    }

    const Invest = await this.prisma.invest.findUnique({
      where: {
        id: id
      }
    });

    if(!Invest){
      throw new BadRequestException("There is no invest with this id!");
    }else if(Invest.company_id !== req.user.id){
      //other companies
      throw new UnauthorizedException();
    }else if(Invest.state !== InvestState.PENDING){
      //Already accepted or rejected
      throw new BadRequestException("This invest is not in a pending state!");
    }

    await this.investService.update(id, updateInvestDto);
    return {
      statusCode: HttpStatus.OK,
      message: "status updated!"
    };
  }

  @Delete('invest/:id')
  @UseGuards(JwtAuthGuard)
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({summary: "Cancel a pendeing invest"})
  @ApiOkResponse({description: "Canceled!"})
  @ApiBadRequestResponse({
    description: 
      `\n
      There is no invest with this id!\n
      This invest is not in a pending state!\n
      `
    })
  @ApiUnauthorizedResponse({
    description: 
      `\n
      Unauthorized!\n
      Only persons can cancel a pending invest!\n
      `
    })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    if(req.user.role !== Role.PERSON){
      throw new UnauthorizedException("Only persons can cancel a pending invest!");
    }

    const invest = await this.prisma.invest.findUnique({
      where: {
        id: id
      }
    });

    if(!invest){
      throw new BadRequestException("There is no invest with this id!");
    }
    else if(invest.investor_id !== req.user.id){
      //other persons
      throw new UnauthorizedException();
    }
    else if(invest.state !== InvestState.PENDING){
      throw new BadRequestException("This invest is not in a pending state!");
    }
    else{
      await this.investService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: "Canceled!"
      }
    }
  }
}
