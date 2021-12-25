import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import * as vars from './../../variables';

export class CreateTagDto {
    @ApiProperty({
        minLength : vars.tagNameMinLength,
        maxLength : vars.tagNameMaxLength,
    })
    @IsString()
    @MinLength(vars.tagNameMinLength, {
        message : `Tag name must be at least ${vars.tagNameMinLength} characters.`,
    })
    @MaxLength(vars.tagNameMaxLength, {
        message : `Tag name must be at most ${vars.tagNameMaxLength} characters.`
    })
    name: string
}
