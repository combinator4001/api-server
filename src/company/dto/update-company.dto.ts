import { PartialType } from '@nestjs/swagger';
import { CreateCompanyReqDto } from './create-company-req.dto';

export class UpdateCompanyReqDto extends PartialType(CreateCompanyReqDto) {}
