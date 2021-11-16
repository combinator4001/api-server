import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ForgetPassJwtAuthGuard extends AuthGuard('forgetPassJwt') {}