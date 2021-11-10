import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('person')
@ApiTags('Person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({
    description : 'Person registered.'
  })
  @ApiBadRequestResponse({
    description : 'Invalid fields'
  })
  @ApiUnauthorizedResponse({
    description : 'Username already exists.'
  })
  @ApiInternalServerErrorResponse({
    description : 'Failed to register, try again later.'
  })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  //search person
  // @Get()
  // findAll() {
  //   return this.personService.findAll();
  // }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.personService.findOne(username);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
