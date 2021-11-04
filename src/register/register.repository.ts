import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterRepository{
	async registerAdmin(){
        //Not implemented yet
        return;
    }

    async registerPerson({username, password, firstName, lastName, email}){
        
        const prisma: PrismaClient = new PrismaClient();
        
        //Check username exists or not
        let resultUser = await prisma.user.findUnique({
			where : {
					username
                }
		});
		if(resultUser){
			//username exists
            throw new HttpException('Username already exists.', HttpStatus.BAD_REQUEST);
		}
        
        //New username
        const saltOrRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltOrRounds);

		resultUser = await prisma.user.create({
			data:{
				username : username,
				password : hashedPassword,
				role : Role.PERSON,

				person : {
					create: {
						firstName,
						lastName,
						email
					}
				}
			}
		});

		if(resultUser){
			return;
		}
		else{
			throw new HttpException('Failed to register, try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

    async registerCompany({username, password, name, email}){
        const prisma: PrismaClient = new PrismaClient();
        
        //Check username exists or not
        let resultUser = await prisma.user.findUnique({
			where : {
					username
                }
		});
		if(resultUser){
			//username exists
            throw new HttpException('Username already exists.', HttpStatus.BAD_REQUEST);
		}

		//New username
        const saltOrRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltOrRounds);

		resultUser = await prisma.user.create({
			data:{
				username : username,
				password : hashedPassword,
				role : Role.COMPANY,
	
				company : {
					create: {
						name : name,
						email : email
					}
				}
			}
		});

		if(resultUser){
			return;
		}
		else{
			throw new HttpException('Failed to register, try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }
}