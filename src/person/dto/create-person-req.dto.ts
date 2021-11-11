import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import * as vars from './../../variables';

export class CreatePersonReqDto {
    // 1.username
    @ApiProperty({
        minLength : vars.usernameMinLentgh,
        maxLength : vars.usernameMaxLentgh,
    })
    @IsString()
    @MinLength(vars.usernameMinLentgh, {
        message : `username must be at least ${vars.usernameMinLentgh} characters.`,
      })
    @MaxLength(vars.usernameMaxLentgh, {
        message : `username must be at most ${vars.usernameMaxLentgh} characters.`
    })
    username : string;

    // 2.password
    @ApiProperty({
        minLength : vars.passwordMinLength,
        maxLength : vars.passwordMaxLength
    })
    @IsString()
    @MinLength(vars.passwordMinLength, {
        message : `password must be at least ${vars.passwordMinLength} characters.`,
      })
    @MaxLength(vars.passwordMaxLength, {
        message : `password must be at most ${vars.passwordMaxLength} characters.`
    })
    password : string;

    // 3.firstName
    @ApiProperty({
        minLength : vars.nameMinLength,
        maxLength : vars.nameMaxLength
    })
    @IsString()
    @MinLength(vars.nameMinLength, {
        message: `firstName must be at least ${vars.nameMinLength} characters.`,
    })
    @MaxLength(vars.nameMaxLength, {
        message : `firstName must be at most ${vars.nameMaxLength} characters.`,
    })
    firstName : string; 

    // 4.lastName
    @ApiProperty({
        minLength : vars.nameMinLength,
        maxLength : vars.nameMaxLength
    })
    @IsString()
    @MinLength(vars.nameMinLength, {
        message: `lastName must be at least ${vars.nameMinLength} characters.`,
    })
    @MaxLength(vars.nameMaxLength, {
        message : `lastName must be at most ${vars.nameMaxLength} characters.`,
    })
    lastName : string;

    // 5.email
    @ApiProperty({
        description : 'Email regex required'
    })
    @IsString()
    @IsEmail()
    email : string;
}
