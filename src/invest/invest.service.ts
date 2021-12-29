import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';
import { UpdateInvestDto } from './dto/update-invest.dto';
import { InvestState } from '@prisma/client';
import { EmailService } from 'src/app/email.service';

@Injectable()
export class InvestService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ){}

  async makeInvest(
    personId: number,
    personUsername: string,
    companyId: number, 
    companyEmail: string,
    blogTitle: string,
    money: number
  ) {
    const subject = `${personUsername} wants to invest in your company!`
    const message = 
    `
      <h2>Hi there!</h2>
      I have read your blog post about "${blogTitle}" and I would like to invest ${money}$ in your company.
    `;

    await this.prisma.invest.create({
      data: {
        investor_id: personId,
        company_id: companyId,
        state: InvestState.PENDING,
        message: message,
        money: money
      }
    });

    this.emailService.sendOneMail(companyEmail, subject, message);
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
