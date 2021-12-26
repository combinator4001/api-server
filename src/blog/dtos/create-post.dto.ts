import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateBlogDto{
    @ApiProperty()
    @IsString()
    title : string;
    
    @ApiProperty()
    @IsString()
    content : string;

    @ApiProperty()
    @IsNumber()
    estimatedMinutes : number;

    @ApiProperty({
        description: "Array of tag ids, which you want to be added.",
        type: 'array',
        items: {
            type: 'number'
        }
    })
    @IsArray()
    @IsNumber({},{each: true})
    tagIds : number[];
}