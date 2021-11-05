import { Injectable } from '@nestjs/common';
import { RegisterRepository } from './register.repository';
import { registerPersonUserDto } from './dtos/register-person-user.dto';
import { registerCompanyUserDto } from './dtos/register-company-user.dto';

@Injectable()
export class RegisterService{
    constructor(private registerRepository : RegisterRepository){}

    async registerAdmin(){
        //Not implemented yet
        return;
    }
 
    async registerPerson(dto : registerPersonUserDto){
        return this.registerRepository.registerPerson(dto);
    }

    async registerCompany(dto : registerCompanyUserDto){
        return this.registerRepository.registerCompany(dto)
    }
}