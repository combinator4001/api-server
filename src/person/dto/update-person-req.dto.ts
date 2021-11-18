import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreatePersonReqDto } from './create-person-req.dto';

export class UpdatePersonReqDto extends PartialType(CreatePersonReqDto) {
    @ApiProperty({required : false})
    @IsOptional()
    @IsBoolean()
    showEmail : boolean

    @ApiProperty({required : false})
    @IsOptional()
    @IsString()
    bio : string
}
