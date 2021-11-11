import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { usernameMinLentgh, usernameMaxLentgh} from './../../variables';

export class LoginReqDto {
    @ApiProperty({
        minLength : usernameMinLentgh,
        maxLength : usernameMaxLentgh,
    })
    @IsString()
    @MinLength(usernameMinLentgh, {
        message : `username must be at least ${usernameMinLentgh} characters.`,
      })
    @MaxLength(usernameMaxLentgh, {
        message : `username must be at most ${usernameMaxLentgh} characters.`
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
