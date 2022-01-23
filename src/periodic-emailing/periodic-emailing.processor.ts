import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from 'src/app/email.service';
import { PrismaService } from 'src/app/prisma.service';

type JobData = {
  id: number
  username: string
  email: string
  tags: {
    id: number
    name: string
  }[]
  date: string
}

@Processor('MonthlyMails')
export class PeriodicEmailingProcessor {
  constructor(
    private emailService: EmailService,
    private prisma: PrismaService
  ){}
  private readonly logger = new Logger(PeriodicEmailingProcessor.name);

  @Process()
  async handleEmails(job: Job) {
    this.logger.debug(job.data);
    const data: JobData = job.data;

    //make dates for query
    const lastMonthDate: Date = new Date(data.date);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const todayDate = data.date;

    //make tag id for using with in operator
    const tagIds: number[] = data.tags.map((tag: {
      id: number;
      name: string
    }): number => tag.id)
    
    //date query + find related tags
    let blogs = await this.prisma.blog.findMany({
      where: {
        createdAt: {
          gte: lastMonthDate,
          lte: todayDate
        }
      },
      include: {
        tags: {
          select: {
            tag_id: true
          },
          where: {
            tag_id: { in: tagIds}
          }
        }
      }
    });

    //remove unrelated records
    blogs = blogs.filter(blog => blog.tags.length !== 0);

    if(blogs.length === 0) {
      const body = 
      `
        <h3>Hi ${data.username}!</h3>
          <p>Unfortunately past month there was no blogs written about tags, which you follow:)</p>
      `;
      this.emailService.sendOneMail(data.email, "Tags you follow", body);
      return;
    }
  
    if(blogs.length > 5) {
      blogs = blogs.slice(0, 5);
    }

    let body = 
    `
      <h3>Hi ${data.username}!</h3>
        <p>You may be interested in reading following blog posts:<p>
    `;

    for (const blog of blogs) {
      body += `<p><a href="${blog.contentUrl}">${blog.title}</a></p>`
    }

    this.emailService.sendOneMail(data.email, "Tags you follow", body)
  }
}