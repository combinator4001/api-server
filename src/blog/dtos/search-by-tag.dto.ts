import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt } from "class-validator";
import * as vars from './../../variables';

export class SearchByTag{
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
    @ArrayNotEmpty()
    @IsInt({each: true})
    tagIds: number[]
}