import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto{
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