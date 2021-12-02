import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateCompanyReqDto } from './create-company-req.dto';


export class UpdateCompanyReqDto extends PartialType(CreateCompanyReqDto) {
    @ApiProperty({required : false})
    @IsOptional()
    @IsBoolean()
    showEmail : boolean

    @ApiProperty({required : false})
    @IsOptional()
    @IsString()
    bio : string
}
