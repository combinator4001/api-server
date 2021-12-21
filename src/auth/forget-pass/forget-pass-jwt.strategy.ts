import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Role } from '.prisma/client';
import { AuthService } from '../auth.service';

type Payload = {
  id : number,
  username : string,
  role : Role,
  hashedPassLastTenChars : string
} 

@Injectable()
export class ForgetPassJwtStrategy extends PassportStrategy(Strategy, 'forgetPassJwt') {
  constructor(private authService : AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Authorization
   * Adds an user object to req object
   * @param payload 
   * @returns 
   */
  async validate(payload: Payload) {
    const tokenIsUsed = await this.authService.forgetTokenIsUsed(payload.id, payload.hashedPassLastTenChars);
    if(tokenIsUsed){
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return { 
      id: payload.id, 
      username: payload.username,
      role : payload.role,
      hashedPassLastTenChars : payload.hashedPassLastTenChars
    };
  }
}