import { PartialType } from '@nestjs/swagger';
import { CreatePersonReqDto } from './create-person-req.dto';

export class UpdatePersonReqDto extends PartialType(CreatePersonReqDto) {}
