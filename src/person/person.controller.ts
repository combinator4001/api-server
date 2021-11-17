import { Controller, Post, Body } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonReqDto } from './dto/create-person-req.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreatePersonCreatedResDto, CreatePersonUnauthorizedResDto, CreatePersonBadRequestResDto } from './dto/create-person-res.dto';

@Controller('person')
@ApiTags('Person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @ApiOperation({ summary: 'Register a person' })
  @ApiCreatedResponse({
    description : 'Person registered.',
    type: CreatePersonCreatedResDto
  })
  @ApiBadRequestResponse({
    description : 'Invalid fields',
    type : CreatePersonBadRequestResDto
  })
  @ApiUnauthorizedResponse({
    description : 'Username already exists.',
    type : CreatePersonUnauthorizedResDto
  })
  @ApiInternalServerErrorResponse({
    description : 'Failed to register, try again later.'
  })
  async create(@Body() createPersonReqDto: CreatePersonReqDto) {
    return await this.personService.create(createPersonReqDto);
  }
}