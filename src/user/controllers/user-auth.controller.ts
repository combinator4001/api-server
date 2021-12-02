import { Controller, Post, Get, Request, Body, UseGuards, Delete, UseInterceptors, UploadedFile, HttpStatus, Put, HttpCode, HttpException, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExtraModels, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiPayloadTooLargeResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/general/local-auth.guard';
import { UserService } from './../services/user-auth.service';
import { LoginReqDto } from './../dtos/login-req.dto';
import { LoginPersonResDto, LoginCompanyResDto, FailedLoginDto } from './../dtos/login-res.dto';
import { ForgetPassJwtAuthGuard } from 'src/auth/forget-pass/forget-pass-jwt-auth.guard';
import { SendResetPassLinkDto } from '../dtos/auth-dtos/send-reset-pass-link.dto';
import { AuthService } from 'src/auth/auth.service';
import { ChangePassDto } from '../dtos/auth-dtos/change-pass.dto';

@ApiTags('User / Auth')
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
}
