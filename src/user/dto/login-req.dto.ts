import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginReqDto {
    @ApiProperty({
        minLength : 6,
        maxLength : 20,
    })
    @IsString()
    @MinLength(6, {
        message : 'username must be at least 6 characters.',
      })
    @MaxLength(20, {
        message : 'username must be at most 20 characters.'
    })
    username : string;

    @ApiProperty({
        minLength : 6,
        maxLength : 100
    })
    @IsString()
    @MinLength(6, {
        message : 'password must be at least 6 characters.',
      })
    @MaxLength(100, {
        message : 'password must be at most 100 characters.'
    })
    password : string;
}
