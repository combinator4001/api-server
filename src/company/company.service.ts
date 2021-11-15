import { CreateCompanyReqDto } from './dto/create-company-req.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Role } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateCompanyCreatedResDto } from './dto/create-company-res.dto';



@Injectable()
export class CompanyService {
  constructor(
    private prisma : PrismaService,
    private authService: AuthService
  ){}


  async create(createCompanyReqDto: CreateCompanyReqDto) {
    const {username, password, name, email , owners} = createCompanyReqDto;

    //Check username exists or not
    let resultUser = await this.prisma.user.findUnique({
      where : {
        username
      }
    });
    if(resultUser){
      //401
      //username exists
      throw new HttpException({
        statusCode : HttpStatus.UNAUTHORIZED,
        message : 'Username already exists.'
      }, HttpStatus.UNAUTHORIZED);
    }
    
    //New username
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);


    resultUser = await this.prisma.user.create({
      data:{
        username : username,
        password : hashedPassword,
        role : Role.COMPANY,
        email : email,
        company : {
          create: {
            name,
            owners
          }
        }
      }
    });


    if(resultUser){
      //201
      let {id, password, imageName , ...rest} = resultUser;
      let user : any;
      user = rest;
      user.access_token = await this.authService.createToken(resultUser.id, resultUser.username, resultUser.role);
      user.name = name;
      user.owners = owners;
      return new CreateCompanyCreatedResDto(user);
		}
		else{
      //500
		  throw new HttpException(        {
        statusCode : HttpStatus.INTERNAL_SERVER_ERROR,
        message : 'Failed to register, try again later.'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
		}



  }


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
