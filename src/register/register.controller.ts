import { Body, Controller, Post } from '@nestjs/common';

@Controller('register')
export class RegisterController {
    @Post('/admin')
    createAdminUser(@Body() body : any){

    }

    @Post('/person')
    createPersonUser(@Body() body : any){
        
    }

    @Post('/company')
    createCompanyUser(@Body() body : any){

    }
}
