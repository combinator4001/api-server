import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Role } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';




@Injectable()
export class CompanyService {
  constructor(private prisma : PrismaService){}

  // async create(createCompanyDto: CreateCompanyDto) {
  //   const {username, password, name, email} = createCompanyDto;
  //  
  //   //Check company exists or not
  //   let resultUser = await this.prisma.user.findUnique({
  //     where : {
  //       username
  //     }
  //   });
  //   if(resultUser){
  //     //username exists
  //     throw new HttpException('Username already exists.', HttpStatus.UNAUTHORIZED);
  //   }

  //   //New username
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);

  //   resultUser = await this.prisma.user.create({
  //     data:{
  //       username : username,
  //       password : hashedPassword,
  //       role : Role.COMPANY,

	// 			company : {
	// 				create: {
	// 					name : name,
	// 					email : email
	// 				}
	// 			}
  //     }
  //   });

  //   if(resultUser){
	// 	  return;
	// 	}
	// 	else{
	// 	  throw new HttpException('Failed to register, try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
	// 	}
  // }
}
