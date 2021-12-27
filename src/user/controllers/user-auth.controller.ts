import { Controller, Post, Get, Request, Body, UseGuards, Delete, UseInterceptors, UploadedFile, HttpStatus, Put, HttpCode, HttpException, Param, Query } from '@nestjs/common';
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
import { SendVerifyEmailLinkDto } from '../dtos/auth-dtos/send-verify-email-link.dto';
import { PrismaService } from 'src/app/prisma.service';
import { EmailService } from 'src/app/email.service';
import { apiServerUrl, frontServerUrl } from 'src/variables';
import { EmailVerifyJwtAuthGuard } from 'src/auth/verify-email/verify-email-jwt-auth.guard';

@ApiTags('Auth')
@Controller('')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private prisma: PrismaService,
        private emailService : EmailService
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
    @ApiUnauthorizedResponse({description : 'Unauthorized. - Please verify your email first!'})
    async login(@Request() req, @Body() body : LoginReqDto ) {
        return await this.userService.login(req.user);
    }

    @Post('auth/password')
    @ApiOperation({summary : 'sends a reset password link.'})
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

    @Post('auth/verify')
    @HttpCode(200)
    @ApiOperation({summary : 'sends a verify email link.'})
    @ApiOkResponse({description: 'If provided email is valid, we will send you an email!'})
    @ApiBadRequestResponse({description : 'An email must be given.'})
    async sendVerifyEmail(@Body() body: SendVerifyEmailLinkDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if(!user || user.verifiedEmail === true){
            return {
                statusCode : HttpStatus.OK,
                message : 'If provided email is valid, we will send you an email!'
            };
        }

        const verifyEmailToken = await this.authService.createVerifyEmailToken(
            user.id,
            user.username,
            user.role,
            user.verifiedEmail
        );

        const link = frontServerUrl + '/verify' + '?token=' + verifyEmailToken;
        const htmlBody : string = `
            <h1>Email verification</h1>
            <br>
            <p>Hello ${user.username}</p>
            <p>You registered an account on Combinator.com, before being able to use your account you need to verify that this is your email address by clicking here: <a href="${link}">Verify</a></p>
            <br>
            If you did not make this request then please ignore this email.
        `;
        await this.emailService.sendOneMail(user.email, 'Email verify', htmlBody);
        return {
            statusCode : HttpStatus.OK,
            message : 'If provided email is valid, we will send you an email!'
        };
    }

    @UseGuards(EmailVerifyJwtAuthGuard)
    @Put('auth/verify')
    @ApiOperation({summary : 'verifies email.'})
    @ApiHeader({name : 'Authorization'})
    @ApiOkResponse({description: 'Email verified!'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    async verifyEmail(@Request() req){
        await this.prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                verifiedEmail: true
            }
        });
        return {
            statusCode : HttpStatus.OK,
            message : 'Email verified!'
        };
    }
}
