import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Register a company' })
  @ApiCreatedResponse({
    description : 'Company registered.'
  })
  @ApiUnauthorizedResponse({
    description : 'Username already exists'
  })
  @ApiBadRequestResponse({
    description : 'Invalid fields'
  })
  @ApiInternalServerErrorResponse({
    description : 'Failed to register, try again later.'
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    // return this.companyService.create(createCompanyDto);
  }
}
