import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/app/prisma.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { User, Tag } from '@prisma/client';

@Injectable()
export class PeriodicEmailingService {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('MonthlyMails') private monthlyMailsQueue: Queue
    ){}

    private readonly logger = new Logger(PeriodicEmailingService.name);

    private yyyymmdd(date: Date): string {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();
      
        return [date.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join('-');
    };

    /**
     * Gui:
     * https://crontab.guru/#0_1_1_*_*
     * 
     * monthly:
     * 0 1 1 * *
     * min - hour - day of month - month - day of week
     * for example 2022-02-01 01:00:00
     * 
     * every minute: * / 1 * * * *
     * 
     */
    @Cron('0 1 1 * *')
    async scheduleEmails() {
        const limit = 1000;
        let date = new Date();
        date = new Date(this.yyyymmdd(date));
        let users = await this.prisma.user.findMany({
            take: limit,
            orderBy: {
                id: 'asc'
            },
            include: {
                followingTags: {
                    select: {
                        Tag: true
                    }
                }
            }
        });
        if(users.length === 0) return;
        let myCursor = users[users.length - 1].id;
        await this.addJobs(users, date);

        while (users.length === limit) {
            let users = await this.prisma.user.findMany({
                take: limit,
                skip: 1,
                cursor: {
                    id: myCursor
                },
                orderBy: {
                    id: 'asc'
                },
                include: {
                    followingTags: {
                        select: {
                            Tag: true
                        }
                    }
                }
            });
            await this.addJobs(users, date);
        }
    }

    /**
     * function for adding jobs to the email queue
     * @param users 
     */
    private async addJobs(users: (User & {
        followingTags: {
            Tag: Tag
        }[]
    })[], date: Date){
        for (const user of users) {
            const tags = user.followingTags.map(item => {
                return {
                    id: item.Tag.id,
                    name: item.Tag.name
                }
            });

            if(tags.length === 0){
                continue;
            }

            const job = await this.monthlyMailsQueue.add({
                id: user.id,
                username: user.username,
                email: user.email,
                tags: tags,
                date: date
            },
            {
                removeOnComplete: true
            });
        }
    }
}
