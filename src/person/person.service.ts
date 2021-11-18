import { Person, Role, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../app/prisma.service';
import { CreatePersonReqDto } from './dto/create-person-req.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import {CreatePersonCreatedResDto} from './dto/create-person-res.dto';
import { UpdatePersonReqDto } from './dto/update-person-req.dto';
import { saltOrRounds } from 'src/variables';
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
      let {id, password, imageName , ...rest} = resultUser;
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

  async update(id : number ,updatePersonReqDto : UpdatePersonReqDto){
    const personUser : User & { person : Person } = await this.prisma.user.findUnique({
      where : {
        id : id
      },
      include : {
        person : true
      }
    })

    const hashedPassword = updatePersonReqDto.password ? await bcrypt.hash(updatePersonReqDto.password, saltOrRounds) : personUser.password;

    const updatedPersonUser = await this.prisma.user.update({
      where : {
        id : id
      },
      data : {
        password : hashedPassword,
        email : updatePersonReqDto.email ?? personUser.email,
        showEmail : updatePersonReqDto.showEmail ?? personUser.showEmail,
        bio : updatePersonReqDto.bio ?? personUser.bio,
        person : {
          update : {
            firstName : updatePersonReqDto.firstName ?? personUser.person.firstName,
            lastName : updatePersonReqDto.lastName ?? personUser.person.lastName
          }
        }
      }
    });
  }

  async findPersonUserById(id : number){
    const personUser : User & { person : Person } = await this.prisma.user.findUnique({
      where : {
        id : id
      },
      include : {
        person : true
      }
    })
    if(!personUser) return null;
    return personUser;
  }
}
