import { Controller, Post, Get, Request, Body, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from './user.service';
import { LoginReqDto } from './dto/login-req.dto';
import { LoginResDto } from './dto/login-res.dto';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Issues a token to a valid user.' })
  @ApiCreatedResponse({
    description : 'JSON web token created.',
    type : LoginResDto
  })
  @ApiUnauthorizedResponse({
    description : 'Invalid credentials.'
  })
  async login(@Request() req, @Body() body : LoginReqDto ) {
    return this.authService.signToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @ApiOperation({summary: 'Returns the given username profile.'})
  getProfile(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }

  @Get(':username/followers')
  @ApiOperation({summary: 'Returns the given username followers.'})
  getFollowers(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }

  @Get(':username/following')
  @ApiOperation({summary: 'Returns the given username following.'})
  getFollowing(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }
}
