import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @ApiProperty({required : false})
    @IsArray()
    @IsOptional()
    tags : string[];
}