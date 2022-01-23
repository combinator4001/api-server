import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreatePersonReqDto } from './create-person-req.dto';
import * as vars from './../../variables';

export class UpdatePersonReqDto extends PartialType(CreatePersonReqDto) {
    @ApiProperty({required : false})
    @IsOptional()
    @IsBoolean()
    showEmail : boolean

    @ApiProperty({
        required : false,
        maxLength : vars.bioMaxLength
    })
    @IsOptional()
    @IsString()
    @MaxLength(vars.bioMaxLength, {
        message : `bio must be at most ${vars.bioMaxLength} characters.`,
    })
    bio : string
}
