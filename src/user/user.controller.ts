import { Controller, Post, Get, Request, Body, UseGuards, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiExtraModels, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiPayloadTooLargeResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from './user.service';
import { LoginReqDto } from './dto/login-req.dto';
import { LoginPersonResDto, LoginCompanyResDto, FailedLoginDto } from './dto/login-res.dto';
import { FollowReqDto } from './dto/follow-req.dto';
import { UnfollowReqDto } from './dto/unfollow-req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from './helpers/profile-image.storage';

@ApiTags('User')
@Controller('')
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  //Auth section

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Issues a token to a valid user.' })
  @ApiExtraModels(LoginPersonResDto, LoginCompanyResDto)
  @ApiCreatedResponse({
    description : 'JSON web token created.',
    schema : {
      oneOf : [
        { $ref : getSchemaPath(LoginPersonResDto)},
        { $ref : getSchemaPath(LoginCompanyResDto)}
      ]
    }
  })
  @ApiUnauthorizedResponse({
    description : 'Unauthorized.',
    type : FailedLoginDto
  })
  async login(@Request() req, @Body() body : LoginReqDto ) {
    return await this.userService.login(req.user);
  }


  //Following section

  @Get(':username/following')
  @ApiOperation({summary: 'Returns the given username following.'})
  getFollowing(@Request() req) {
    //console.log(req.user);
    return 'these are the followings';
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/following')
  @ApiHeader({name : 'Authorization'})
  @ApiOperation({ summary: 'User follows another user.' })
  @ApiCreatedResponse({ description : 'Followed successfully!'})
  // BadRequest : 1.Already followed 2.followingUsername not found
  @ApiBadRequestResponse({description : 'followingUsername not found.'})
  // Unauthorized : 1.invalid jwt, 2.malicious payload(user not found)
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  @ApiInternalServerErrorResponse({description : 'Server error'})
  follow(@Request() req, @Body() followReqDto : FollowReqDto){
    //req.user is the payload which we have received.
    return this.userService.follow(req.user.id, followReqDto.followingUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/following')
  @ApiOperation({ summary: 'User unfollows another user.' })
  @ApiHeader({name : 'Authorization'})
  @ApiOkResponse({ description : 'Unfollowed successfully!'})
  @ApiBadRequestResponse({description : 'unfollowUsername not found.'})
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  @ApiInternalServerErrorResponse({description : 'Server error'})
  unFollow(@Request() req, @Body() unfollowReqDto : UnfollowReqDto){
    return this.userService.unfollow(req.user.id, unfollowReqDto.unfollowUsername);
  }


  //Followers section

  @Get(':username/followers')
  @ApiOperation({summary: 'Returns the given username followers.'})
  getFollowers(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/followers')
  @ApiOperation({ summary: 'User removes another user from his/her followers.' })
  @ApiHeader({name : 'Authorization'})
  removeFollower(){

  }


  // Profile section

  @Get(':username')
  @ApiOperation({summary: 'Returns the given username profile.'})
  getProfile(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', saveImageToStorage)
  )
  @ApiBadRequestResponse({description : 'File must be a png, jpg/jpeg'})
  @ApiPayloadTooLargeResponse({description : 'File too large'})
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = file?.filename;
    
    if(!fileName){
      return {
        statusCode : HttpStatus.BAD_REQUEST,
        message : 'File must be a png, jpg/jpeg'
      };
    }
    else{
      return {
        statusCode : HttpStatus.CREATED,
        message : 'Profile image updated!'
      };
    }

  }
}
