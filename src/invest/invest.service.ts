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

  async inboxCompany(
    page: number,
    limit: number,
    companyId: number
  ) {
    const skip = (page - 1) * limit;
    const take = limit;
    await this.prisma.invest.findMany({
      where: {
        company_id: companyId
      },
      orderBy:{
        id: 'desc'
      },
      skip,
      take
    })
  }

  async sentPerson(){

  }

  update(id: number, updateInvestDto: UpdateInvestDto) {
    return `This action updates a #${id} invest`;
  }

  remove(id: number) {
    return `This action removes a #${id} invest`;
  }
}
