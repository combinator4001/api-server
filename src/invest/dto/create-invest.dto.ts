import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import * as vars from './../../variables';

export class CreateInvestDto {
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
    companyUsername: string
}
