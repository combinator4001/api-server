import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import * as vars from './../../../variables';

export class ChangePassDto{
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
    newPassword : string;
}