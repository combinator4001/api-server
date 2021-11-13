import { PrismaClient, Role, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginPersonResDto } from './dto/login-res.dto'

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

  /**
   * Follows another user.
   * @param id 
   * @param followingUsername 
   * @returns 201, 400, 401
   */
   async follow(id : number, followingUsername : string){
    const user = await this.prisma.user.findUnique({
      where : {
        id : id
      }
    })

    if(!user){
      // 401
      // malicious payload
      throw new HttpException({
        statusCode : HttpStatus.UNAUTHORIZED,
        message : 'Unauthorized!'
      }, HttpStatus.UNAUTHORIZED);  
    }

    const following = await this.prisma.user.findUnique({
      where : {
        username : followingUsername
      }
    })

    if(!following){
      // no one to follow
      return {
        statusCode : HttpStatus.BAD_REQUEST,
        message : 'followingUsername not found!'
      }
    }

    const result = await this.prisma.user.update({
      where : {id : user.id},
      data : {
        following : {
          connect : {
            id : following.id
          }
        }
      }
    })

    if(result){
      //201
      return {
        statusCode : HttpStatus.CREATED,
        message : 'Followed!'
      }
    }
  }

  /**
   * Unfollows another user.
   * @param id 
   * @param unfollowUsername 
   * @returns 
   */
  async unfollow(id : number, unfollowUsername : string){
    const user = await this.prisma.user.findUnique({
      where : {
        id : id
      }
    })

    if(!user){
      // 401
      // malicious payload
      throw new HttpException({
        statusCode : HttpStatus.UNAUTHORIZED,
        message : 'Unauthorized!'
      }, HttpStatus.UNAUTHORIZED);  
    }

    const unfollowUser = await this.prisma.user.findUnique({
      where : {
        username : unfollowUsername
      }
    });

    if(!unfollowUser){
      // no one to unfollow
      return {
        statusCode : HttpStatus.BAD_REQUEST,
        message : 'unfollowUsername not found!'
      };
    }

    const result = await this.prisma.user.update({
      where : {id : user.id},
      data : {
        following : {
          disconnect : {
            id : unfollowUser.id
          }
        }
      }
    });

    if(result){
      //201
      return {
        statusCode : HttpStatus.CREATED,
        message : 'Unfollowed!'
      };
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
}
