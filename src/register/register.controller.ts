import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { registerPersonUserDto } from './dtos/register-person-user.dto';
import { registerCompanyUserDto } from './dtos/register-company-user.dto';
import { RegisterService } from './register.service';
@ApiTags('Register')
@Controller('register')
export class RegisterController {
    constructor(private registerService : RegisterService){}
    
    @Post('/admin') 
    @ApiForbiddenResponse({
        description : 'Not allowed'
    })
    registerAdminUser(@Body() body : any){
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @Post('/person')
    @ApiCreatedResponse({
        description : 'Person registered.'
    })
    @ApiBadRequestResponse({
        description : 'Username already exists. / Invalid fields'
    })
    @ApiInternalServerErrorResponse({
        description : 'Failed to register, try again later.'
    })
    registerPersonUser(@Body() body : registerPersonUserDto){
        return this.registerService.registerPerson(body);
    }

    @Post('/company')
    @ApiCreatedResponse({
        description : 'Company registered.'
    })
    @ApiBadRequestResponse({
        description : 'Username already exists. / Invalid fields'
    })
    @ApiInternalServerErrorResponse({
        description : 'Failed to register, try again later.'
    })
    registerCompanyUser(@Body() body : registerCompanyUserDto){
        return this.registerService.registerCompany(body);
    }
}
