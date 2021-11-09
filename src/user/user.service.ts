import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma : PrismaService){}

  /**
   * Returns the user who has the given username
   * @param username 
   * @returns 
   */
  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where : {
        username : username
      }
    })
  }
}
