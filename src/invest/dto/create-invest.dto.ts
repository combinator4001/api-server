import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";
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

    @ApiProperty({
        minLength : vars.titleMinLength,
        maxLength : vars.titleMaxLength,
    })
    @IsString()
    @MinLength(vars.titleMinLength, {
        message : `Title must be at least ${vars.titleMinLength} characters.`,
    })
    @MaxLength(vars.titleMaxLength, {
        message : `Title must be at most ${vars.titleMaxLength} characters.`
    })
    blogTitle : string

    @ApiProperty({
        description: 'In dollars',
        minimum: 10
    })
    @IsNumber()
    @Min(10)
    money: number
}
