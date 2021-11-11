import { Role, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginPersonResDto } from './dto/login-res.dto'

@Injectable()
export class UserService {
  constructor(
    private prisma : PrismaService,
    private authService : AuthService
  ){}

  // /**
  //  * Returns the user who has the given username
  //  * @param username 
  //  * @returns 
  //  */
  // async findOne(username: string): Promise<User | null> {
  //   return this.prisma.user.findUnique({
  //     where : {
  //       username : username
  //     }
  //   })
  // }

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
}
