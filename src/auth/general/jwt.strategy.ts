import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Role } from '.prisma/client';

type Payload = {
  id : number,
  username : string,
  role : Role
} 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
      role : payload.role
    };
  }
}