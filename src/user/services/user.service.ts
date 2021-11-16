import { PrismaClient, Role, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { EmailService } from 'src/app/email.service';
import { PrismaService } from 'src/app/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { frontServerUrl } from 'src/variables';
import { LoginPersonResDto } from './../dtos/login-res.dto'

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
      const result = await this.prisma.person.findUnique({
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
      // const result = await this.prisma.company.findUnique({
      //   where : {
      //     user_id : user.id
      //   }
      // })
      // user.access_token = token;
      // user.name = result.name;
      // user.owners = result.owners;
      // return new LoginPersonResDto(user);
      return {
        message : 'company dto res required!'
      }
    }
  }

  async updateUserImagePathById(userId, imageName){
    await this.prisma.user.update({
      where : {
        id : userId
      },
      data : {
        imageName : imageName
      }
    })
  }

  /**
   * finds an unique user by the given username.
   * @param username 
   * @returns User or null
   */
  async findOneUser(username : string) : Promise< User | null > {
    const user = await this.prisma.user.findUnique({
      where : {
        username : username
      }
    })

    if(!user) return null;

    return user;
  }

  async sendForgetPassEmail(forgetPassToken : string, email : string) : Promise<void>{
    const body : string = `
      Trouble signing in?

      Resetting your password is easy. 

      Just press the link below and follow the instructions.

      ${frontServerUrl + '/reset/' + forgetPassToken}

      If you did not make this request then please ignore this email.
    `;
    await this.emailService.sendOneMail(email, 'Password reset', body);
  }
}
