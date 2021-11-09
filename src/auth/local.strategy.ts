import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';

type resultUser = {
  id : number,
  username : string,
  role : Role
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }  

  /**
   * This method is for the local guard.
   * Authenticates the user.
   * Adds user to req object.
   */
  async validate(username: string, password: string): Promise<resultUser> {
    const user : resultUser = await this.authService.findUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}