import { Controller, Post, Body, Patch, Req, UseGuards, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonReqDto } from './dto/create-person-req.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreatePersonCreatedResDto, CreatePersonUnauthorizedResDto, CreatePersonBadRequestResDto } from './dto/create-person-res.dto';
import { UpdatePersonReqDto } from './dto/update-person-req.dto';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { Role } from '.prisma/client';
import { UpdatePersonResDto } from './dto/update-person-res.dto';

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
    description : 'Username already exists. | Email already exists.',
    type : CreatePersonUnauthorizedResDto
  })
  @ApiInternalServerErrorResponse({
    description : 'Failed to register, try again later.'
  })
  async create(@Body() createPersonReqDto: CreatePersonReqDto) {
    return await this.personService.create(createPersonReqDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    summary : 'Updates person profile.',
    description : 'All fields are optional.'
  })
  @ApiOkResponse({
    description : 'Person profile updated',
    type : UpdatePersonResDto
  })
  @ApiUnauthorizedResponse({
    description : 'Unauthorized!'
  })
  async update(@Req() req , @Body() updatePersonReqDto : UpdatePersonReqDto){
    if(req.user.role !== Role.PERSON){
      throw new UnauthorizedException();
    }
    try{
      await this.personService.update(req.user.id, updatePersonReqDto);
      const result = await this.personService.findPersonUserById(req.user.id);
      return new UpdatePersonResDto(result, result.person);
    }catch(e){
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}