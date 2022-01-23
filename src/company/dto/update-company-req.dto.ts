import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateCompanyReqDto } from './create-company-req.dto';
import * as vars from './../../variables';


export class UpdateCompanyReqDto extends PartialType(CreateCompanyReqDto) {
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
