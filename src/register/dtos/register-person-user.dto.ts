import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class registerPersonUserDto{
    @ApiProperty({
        minLength : 6,
        maxLength : 20,
    })
    @IsString()
    @MinLength(6, {
        message : 'username is too short',
      })
    @MaxLength(20, {
        message : 'username is too long'
    })
    username : string;

    @ApiProperty({
        minLength : 6,
        maxLength : 100
    })
    @IsString()
    @MinLength(6, {
        message : 'password is too short',
      })
    @MaxLength(100, {
        message : 'password is too long'
    })
    password : string;

    @ApiProperty({
        minLength : 1,
        maxLength : 50
    })
    @IsString()
    @MinLength(1, {
        message: 'firstName is too short',
    })
    @MaxLength(50, {
        message : 'firstName is too long'
    })
    firstName : string; 

    @ApiProperty({
        minLength : 1,
        maxLength : 50
    })
    @IsString()
    @MinLength(1, {
        message: 'lastName is too short',
    })
    @MaxLength(50, {
        message : 'lastName is too long'
    })
    lastName : string;

    @ApiProperty({
        description : 'Email regex required'
    })
    @IsString()
    @IsEmail()
    email : string;
}