import { Company, Person, PrismaClient, Role, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailService } from 'src/app/email.service';
import { PrismaService } from 'src/app/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { frontServerUrl } from 'src/variables';
import { LoginCompanyResDto, LoginPersonResDto } from './../dtos/login-res.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma : PrismaService,
    private authService : AuthService,
    private emailService : EmailService
  ){}

  /**
   * Returns a token and user infos.
   * @param user 
   * @returns 
   */
   async login(user : any){
    const token = await this.authService.createToken(user.id, user.username, user.role);
    if(user.role === Role.PERSON){
      const result : Person = await this.prisma.person.findUnique({
        where : {
          user_id : user.id
        }
      })
      user.access_token = token;
      user.firstName = result.firstName;
      user.lastName = result.lastName;
      return new LoginPersonResDto(user);
    }
    else if(user.role === Role.COMPANY){
      const result : Company = await this.prisma.company.findUnique({
        where : {
          user_id : user.id
        }
      })
      user.access_token = token;
      user.name = result.name;
      user.owners = result.owners;
      return new LoginCompanyResDto(user);
    }
  }

  /**
   * finds an unique user by the given username.
   * @param username 
   * @returns User or null
   */
  async findUserByUsername(username : string) : Promise< User | null > {
    const user = await this.prisma.user.findUnique({
      where : {
        username : username
      }
    })

    if(!user) return null;

    return user;
  }

    /**
   * finds an unique user by the given username.
   * @param username 
   * @returns User or null
   */
	async findUserById(id : number) : Promise< User | null > {
      const user = await this.prisma.user.findUnique({
        where : {
          id : id
        }
      })
  
      if(!user) return null;
  
      return user;
    }
  

  /**
   * Sends change pass link to the given email.
   * @param forgetPassToken 
   * @param email 
   */
  async sendForgetPassEmail(forgetPassToken : string, email : string) : Promise<void>{
    const url = frontServerUrl + '/reset/' + forgetPassToken;
    const body : string = `
      <h1>Trouble signing in?</h1>
      <br>
      <p>Resetting your password is easy. Just press the link below and follow the instructions.</p>
      <p><a href="${url}">Reset</a></p>
      <br>
      If you did not make this request then please ignore this email.
    `;
    await this.emailService.sendOneMail(email, 'Password reset', body);
  }

  /**
   * Changes the given id password.
   * @param id 
   * @param newPassword 
   */
  async changePassword(id : number, newPassword : string){
    const saltOrRounds = 10;
    const newHashedPass = await bcrypt.hash(newPassword, saltOrRounds);
    await this.prisma.user.update({
      where : {
        id : id
      },
      data : {
        password : newHashedPass
      }
    })
  }
}
