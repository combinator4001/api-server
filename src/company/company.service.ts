import { CreateCompanyReqDto } from './dto/create-company-req.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Company , Role , User } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateCompanyCreatedResDto } from './dto/create-company-res.dto';
import { saltOrRounds } from 'src/variables';
import { UpdateCompanyReqDto } from './dto/update-company-req.dto';



@Injectable()
export class CompanyService {
  constructor(
    private prisma : PrismaService,
    private authService: AuthService
  ){}

  /**
   * creates a new company in database.
   * @param createCompanyReqDto 
   * @returns 201, 401, 500
   */
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

  async update(id : number ,updateCompanyReqDto : UpdateCompanyReqDto){
    const companyUser : User & { company : Company } = await this.prisma.user.findUnique({
      where : {
        id : id
      },
      include : {
        company : true
      }
    })

    const hashedPassword = updateCompanyReqDto.password ? await bcrypt.hash(updateCompanyReqDto.password, saltOrRounds) : companyUser.password;

    const updatedCompanyUser = await this.prisma.user.update({
      where : {
        id : id
      },
      data : {
        password : hashedPassword,
        email : updateCompanyReqDto.email ?? companyUser.email,
        showEmail : updateCompanyReqDto.showEmail ?? companyUser.showEmail,
        bio : updateCompanyReqDto.bio ?? companyUser.bio,
        company : {
          update : {
            name : updateCompanyReqDto.name ?? companyUser.company.name,
            owners : updateCompanyReqDto.owners ?? companyUser.company.owners
          }
        }
      }
    });
  }

  async findCompanyUserById(id : number){
    const companyUser : User & { company : Company } = await this.prisma.user.findUnique({
      where : {
        id : id
      },
      include : {
        company : true
      }
    })
    if(!companyUser) return null;
    return companyUser;
  }




}
