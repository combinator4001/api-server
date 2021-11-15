import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import * as vars from './../../variables';

export class CreateCompanyReqDto {
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

    // 3.name
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
    name : string; 

    // 4.email
    @ApiProperty({
        description : 'Email regex required'
    })
    @IsString()
    @IsEmail()
    email : string;

    // 5.owners
    @ApiProperty({
        description: 'The list of Owners is here'
    })
    @IsString()
    owners : string [ ];
    
}
