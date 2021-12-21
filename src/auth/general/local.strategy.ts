import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

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
  async validate(username: string, password: string) {
    const user = await this.authService.findUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    if(!user.verifiedEmail){
      throw new HttpException('Please verify your email first!', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}