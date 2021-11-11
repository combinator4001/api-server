import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { usernameMinLentgh, usernameMaxLentgh, passwordMinLength, passwordMaxLength} from './../../variables';

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
        minLength : passwordMinLength,
        maxLength : passwordMaxLength
    })
    @IsString()
    @MinLength(passwordMinLength, {
        message : `password must be at least ${passwordMinLength} characters.`,
      })
    @MaxLength(passwordMaxLength, {
        message : `password must be at most ${passwordMaxLength} characters.`
    })
    password : string;
}
