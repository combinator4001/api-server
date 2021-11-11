import { Role } from '.prisma/client';
import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../app/prisma.service';
import { CreatePersonReqDto } from './dto/create-person-req.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonService {
  constructor(private prisma : PrismaService){}

  /**
   * creates a new person in database.
   * @param createPersonReqDto 
   * @returns 201, 401, 500
   */
  async create(createPersonReqDto: CreatePersonReqDto) {
    const {username, password, firstName, lastName, email} = createPersonReqDto;
    
    //Check username exists or not
    let resultUser = await this.prisma.user.findUnique({
      where : {
        username
      }
    });
    if(resultUser){
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
        role : Role.PERSON,
        email : email,
        person : {
          create: {
            firstName,
            lastName,
          }
        }
      }
    });

    if(resultUser){
		  return 
		}
		else{
		  throw new HttpException(        {
        statusCode : HttpStatus.INTERNAL_SERVER_ERROR,
        message : 'Failed to register, try again later.'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
		}
  }
}
