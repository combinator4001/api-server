import { Controller, Post, Get, Request, Body, UseGuards, Delete, UseInterceptors, UploadedFile, HttpStatus, Put, HttpCode, HttpException, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExtraModels, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiPayloadTooLargeResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/general/local-auth.guard';
import { UserService } from './../services/user.service';
import { LoginReqDto } from './../dtos/login-req.dto';
import { LoginPersonResDto, LoginCompanyResDto, FailedLoginDto } from './../dtos/login-res.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from './../helpers/profile-image.storage';
import { join } from 'path';
import { ImageUploadDto } from './../dtos/image-upload.dto';
import { ForgetPassJwtAuthGuard } from 'src/auth/forget-pass/forget-pass-jwt-auth.guard';
import { SendResetPassLinkDto } from '../dtos/auth-dtos/send-reset-pass-link.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { ChangePassDto } from '../dtos/auth-dtos/change-pass.dto';

@ApiTags('User')
@Controller('')
export class UserController {
    constructor(
        private userService: UserService,
        private authService : AuthService
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

    @Post('auth/password')
    @ApiOperation({summary : 'sends reset password link.'})
    @ApiCreatedResponse({description : 'Email has been sent!'})
    @ApiBadRequestResponse({description : 'Username not found!'})
    async sendResetPassEmail(@Body() body: SendResetPassLinkDto) {
        const user = await this.userService.findUserByUsername(body.username);
        if(!user){
            //400
            throw new HttpException({
                statusCode : HttpStatus.BAD_REQUEST,
                massage : 'Username not found!'
            }, HttpStatus.BAD_REQUEST)
        }

        const forgetPassToken = await this.authService.createForgetPassToken(
            user.id,
            user.username,
            user.role,
            user.password.slice(user.password.length - 10 , user.password.length - 1)
        );

        await this.userService.sendForgetPassEmail(forgetPassToken, user.email);

        return {
            statusCode : HttpStatus.CREATED,
            message : 'Email has been sent!'
        };
    }

    @UseGuards(ForgetPassJwtAuthGuard)
    @Put('auth/password')
    @HttpCode(200)
    @ApiOperation({summary : 'resets the given user password.'})
    @ApiHeader({name : 'Authorization'})
    @ApiOkResponse({description : 'Password changed successfully!'})
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async resetPassword(@Request() req, @Body() body: ChangePassDto ) {
        // req.user = {
        //     id: number, 
        //     username: string,
        //     role : Role,
        //     hashedPassLastTenChars : string
        // }
        
        await this.userService.changePassword(req.user.id, body.newPassword);
        return {
            statusCode : HttpStatus.OK,
            message : 'Password updated!'
        }
    }


  // Profile section

  @Get(':username')
  @ApiOperation({summary: 'Returns the given username profile.'})
  getProfile(@Request() req) {
    //console.log(req.user);
    return 'you are authorized';
  }

    @UseGuards(JwtAuthGuard)
    @Delete('')
    @HttpCode(200)
    @ApiOperation({description : 'Deletes the given username account.'})
    @ApiOkResponse({description : 'Account deleted!'})
    @ApiBadRequestResponse({description : 'User not found!'})
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async deleteUser(@Request() req){
        const user = await this.userService.findUserById(req.user.id);
        if(!user){
            throw new HttpException({
                statusCode : HttpStatus.BAD_REQUEST,
                message : 'User not found!'
            }, HttpStatus.BAD_REQUEST);
        }
        await this.userService.deleteAccount(user.id);
        return {
            statusCode : 200,
            message : 'Account deleted!'
        };
    }



  @UseGuards(JwtAuthGuard)
  @Put('profile-image')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', saveImageToStorage)
  )
  @ApiOperation({description : 'Updates profile image.'})
  @ApiHeader({name : 'Authorization'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Attach the image file',
    type: ImageUploadDto
  })
  @ApiCreatedResponse({description : 'Profile image updated!'})
  @ApiBadRequestResponse({description : 'File must be a png, jpg/jpeg. |  Invalid file.'})
  @ApiPayloadTooLargeResponse({description : 'File too large. File should be less than 300KiB.'})
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req){
    const fileName = file?.filename;
    
    if(!fileName){
      //400
      //wrong file extension
      throw new HttpException({
        statusCode : HttpStatus.BAD_REQUEST,
        message : 'File must be an iamge in png, jpg/jpeg format!'
      }, HttpStatus.BAD_REQUEST);
    }
    else{
      //file extension name is correct 
      //but needs to be checked if it is safe or not

      const imagesFolderPath = join(process.cwd(), 'files/profile-images');
      const fullImagePath = join(imagesFolderPath + '/' + file.filename);

      if(await isFileExtensionSafe(fullImagePath)){

        //200
        this.userService.updateUserImagePathById(req.user.id, fileName);

        return {
          statusCode : HttpStatus.OK,
          message : 'Profile image updated!'
        };

      }
      else{

        //400
        //extension is correct but file is not valid | unsafe extension
        removeFile(fullImagePath);
        throw new HttpException({
          statusCode : HttpStatus.BAD_REQUEST,
          message : 'Invalid file!'
        }, HttpStatus.BAD_REQUEST);

      }
    }
  }
}
