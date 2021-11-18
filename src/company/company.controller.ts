import { Controller, Post, Body, Patch, Req, UseGuards, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyReqDto } from './dto/create-company-req.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateCompanyBadRequestResDto, CreateCompanyCreatedResDto, CreateCompanyUnauthorizedResDto } from './dto/create-company-res.dto';
import {UpdateCompanyReqDto} from './dto/update-company-req.dto';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { Role } from '.prisma/client';
import {UpdateCompanyResDto} from './dto/update-company-res.dto';


@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Register a company' })
  @ApiCreatedResponse({
    description : 'Company registered.',
    type: CreateCompanyCreatedResDto
  })
  @ApiBadRequestResponse({
    description : 'Invalid fields',
    type : CreateCompanyBadRequestResDto
  })
  @ApiUnauthorizedResponse({
    description : 'Username already exists',
    type:CreateCompanyUnauthorizedResDto
  })
  @ApiInternalServerErrorResponse({
    description : 'Failed to register, try again later.'
  })
  async create(@Body() createCompanyReqDto: CreateCompanyReqDto) {
    return await this.companyService.create(createCompanyReqDto);
  }


  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    summary : 'Updates company profile.',
    description : 'All fields are optional.'
  })
  @ApiOkResponse({
    description : 'company profile updated',
    type : UpdateCompanyResDto
  })
  @ApiUnauthorizedResponse({
    description : 'Unauthorized!'
  })
  async update(@Req() req , @Body() updateCompanyReqDto : UpdateCompanyReqDto){
    if(req.user.role !== Role.COMPANY){
      throw new UnauthorizedException();
    }
    try{
      await this.companyService.update(req.user.id, updateCompanyReqDto);
      const result = await this.companyService.findCompanyUserById(req.user.id);
      return new UpdateCompanyResDto(result, result.company);
    }catch(e){
      console.log(e);
      throw new InternalServerErrorException();
    }
  }



}
