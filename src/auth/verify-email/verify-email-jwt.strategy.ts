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
  emailIsVerified : boolean
} 

@Injectable()
export class EmailVerifyJwtStrategy extends PassportStrategy(Strategy, 'emailVerifyJwt') {
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
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      emailIsVerified: payload.emailIsVerified
    };
  }
}