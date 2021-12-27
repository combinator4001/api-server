import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import * as vars from './../../variables';

export class CreateBlogDto{
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
    title : string;
    
    @ApiProperty({
        minLength : vars.blogContentMinLength,
        maxLength : vars.blogContentMaxLength,
    })
    @IsString()
    @MinLength(vars.blogContentMinLength, {
        message: `Content must be at least ${vars.blogContentMinLength} characters.`,
    })
    @MaxLength(vars.blogContentMaxLength, {
        message: `Content must be at most ${vars.blogContentMaxLength} characters.`
    })
    content: string;

    @ApiProperty({
        description: 'Maximum is one day!',
        minimum: vars.estimatedMinutesMin,
        maximum: vars.estimatedMinutesMax
    })
    @IsInt()
    @Min(vars.estimatedMinutesMin)
    @Max(vars.estimatedMinutesMax)
    estimatedMinutes : number;

    @ApiProperty({
        description: "Array of tag ids, which you want to be added.",
        type: 'array',
        items: {
            type: 'number'
        },
        maxItems: vars.tagIdsArrayMaxSize
    })
    @IsArray()
    @ArrayMaxSize(vars.tagIdsArrayMaxSize)
    @IsInt({each: true})
    tagIds : number[]
}