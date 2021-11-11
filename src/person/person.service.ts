import { Role } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../app/prisma.service';
import { CreatePersonReqDto } from './dto/create-person-req.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import {CreatePersonCreatedResDto} from './dto/create-person-res.dto';

@Injectable()
export class PersonService {
  constructor(
    private prisma : PrismaService,
    private authService: AuthService
  ){}

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
      //201
      let {id, password, imageAddress , ...rest} = resultUser;
      let user : any;
      user = rest;
      user.access_token = await this.authService.createToken(resultUser.id, resultUser.username, resultUser.role);
      user.firstName = firstName;
      user.lastName = lastName;
      return new CreatePersonCreatedResDto(user);
		}
		else{
      //500
		  throw new HttpException(        {
        statusCode : HttpStatus.INTERNAL_SERVER_ERROR,
        message : 'Failed to register, try again later.'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
		}
  }
}
