import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './general/local.strategy';
import { jwtConstants } from './constants';
import { JwtStrategy } from './general/jwt.strategy';
import { ForgetPassJwtStrategy } from './forget-pass/forget-pass-jwt.strategy';
import { EmailVerifyJwtStrategy } from './verify-email/verify-email-jwt.strategy';

@Module({
  imports: [ 
    PassportModule,     
    JwtModule.register({
    secret: jwtConstants.secret
  })],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    ForgetPassJwtStrategy,
    EmailVerifyJwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {}
