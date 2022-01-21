import { Module } from '@nestjs/common';
import { UserService } from './services/user-auth.service';
import { UserController } from './controllers/user-auth.controller';
import { AuthModule } from 'src/auth/auth.module';
import { FollowingService } from './services/following.service';
import { FollowingController } from './controllers/following.controller';
import { FollowersController } from './controllers/followers.controller';
import { FollowersService } from './services/followers.service';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports : [
    AuthModule
  ],
  controllers: [
    UserController,
    FollowingController, 
    FollowersController,
    ProfileController
  ],
  providers: [
    UserService,
    FollowingService,
    FollowersService,
    ProfileService
  ]
})
export class UserModule {}
