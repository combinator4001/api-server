import { Controller, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyReqDto } from './dto/create-company-req.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateCompanyBadRequestResDto, CreateCompanyCreatedResDto, CreateCompanyUnauthorizedResDto } from './dto/create-company-res.dto';
import { type } from 'os';

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
}
