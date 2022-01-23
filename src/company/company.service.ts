import { CreateCompanyReqDto } from './dto/create-company-req.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Company , Role , User } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateCompanyCreatedResDto } from './dto/create-company-res.dto';
import { frontServerUrl, saltOrRounds } from 'src/variables';
import { UpdateCompanyReqDto } from './dto/update-company-req.dto';
import { EmailService } from 'src/app/email.service';



@Injectable()
export class CompanyService {
  constructor(
    private prisma : PrismaService,
    private authService: AuthService,
    private emailService: EmailService
  ){}

  /**
   * creates a new company in database.
   * @param createCompanyReqDto 
   * @returns 201, 401, 500
   */
  async create(createCompanyReqDto: CreateCompanyReqDto) {
    const {username, password, name, email , owners} = createCompanyReqDto;

    //Check username exists or not
    let results = await this.prisma.user.findMany({
      where : {
        OR: [
          {
            username: username
          },
          {
            email: email
          }
        ]
      }
    });
    for(const user of results) {

      if(user.username === username){
        //401
        //username exists
        throw new HttpException({
          statusCode : HttpStatus.UNAUTHORIZED,
          message : 'Username already exists.'
        }, HttpStatus.UNAUTHORIZED);
      }
      else if(user.email === email){
        //401
        //email exists
        throw new HttpException({
          statusCode : HttpStatus.UNAUTHORIZED,
          message : 'Email already exists.'
        }, HttpStatus.UNAUTHORIZED);
      }

    }
    
    //New username
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);


    const resultUser = await this.prisma.user.create({
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
      let {id, password, imageUrl , ...rest} = resultUser;
      let user : any;
      user = rest;
      user.access_token = await this.authService.createToken(resultUser.id, resultUser.username, resultUser.role);
      user.name = name;
      user.owners = owners;
      
      const verifyEmailToken = await this.authService.createVerifyEmailToken(
        resultUser.id,
        resultUser.username,
        resultUser.role,
        resultUser.verifiedEmail
      );

      const link = frontServerUrl + '/verify' + '?token=' + verifyEmailToken;
      const htmlBody : string = `
          <h1>Email verification</h1>
          <br>
          <p>Hello ${resultUser.username}</p>
          <p>You registered an account on Combinator.com, before being able to use your account you need to verify that this is your email address by clicking here: <a href="${link}">Verify</a></p>
          <br>
          If you did not make this request then please ignore this email.
      `;
      this.emailService.sendOneMail(user.email, 'Email verify', htmlBody);
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

    const other = await this.prisma.user.findUnique({
      where: {
        email: updateCompanyReqDto.email
      }
    });

    if(other && other.id !== companyUser.id){
      throw new BadRequestException("Email already exist!");
    }


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
