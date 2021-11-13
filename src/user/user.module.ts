import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FollowService } from './follow.service';

@Module({
  imports : [AuthModule],
  controllers: [UserController],
  providers: [UserService, FollowService]
})
export class UserModule {}
