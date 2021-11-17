import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FollowingService } from './services/following.service';
import { FollowingController } from './controllers/following.controller';
import { FollowersController } from './controllers/followers.controller';
import { FollowersService } from './services/followers.service';

@Module({
  imports : [AuthModule],
  controllers: [
    UserController,
    FollowingController, 
    FollowersController
  ],
  providers: [
    UserService,
    FollowingService,
    FollowersService
  ]
})
export class UserModule {}
