import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCompanyDto {
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
        message: 'companyname is too short',
    })
    @MaxLength(50, {
        message : 'companyname is too long'
    })
    name : string; 

    @ApiProperty({
        description : 'Email regex required'
    })
    @IsString()
    @IsEmail()
    email : string;

    //name of owners
}


