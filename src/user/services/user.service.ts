import { PrismaClient, Role, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { PrismaService } from 'src/app/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginPersonResDto } from './../dtos/login-res.dto'

@Injectable()
export class UserService {
  constructor(
    private prisma : PrismaService,
    private authService : AuthService
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

  async resetPasswordToken(user : any){
    user.hashedPassLastTenChars = user.password.slice(user.password.length - 10 , user.password.length - 1);
    const forgetPassToken =  await this.authService.createForgetPassToken(user.id , user.username , user.role , user.hashedPassLastTenChars);
  }

}
