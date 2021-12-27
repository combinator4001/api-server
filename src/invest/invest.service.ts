import { Injectable } from '@nestjs/common';
import { CreateInvestDto } from './dto/create-invest.dto';
import { UpdateInvestDto } from './dto/update-invest.dto';

@Injectable()
export class InvestService {
  create(createInvestDto: CreateInvestDto) {
    return 'This action adds a new invest';
  }

  findAll() {
    return `This action returns all invest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invest`;
  }

  update(id: number, updateInvestDto: UpdateInvestDto) {
    return `This action updates a #${id} invest`;
  }

  remove(id: number) {
    return `This action removes a #${id} invest`;
  }
}
