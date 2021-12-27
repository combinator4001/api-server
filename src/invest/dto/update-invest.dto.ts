import { PartialType } from '@nestjs/swagger';
import { CreateInvestDto } from './create-invest.dto';

export class UpdateInvestDto extends PartialType(CreateInvestDto) {}
