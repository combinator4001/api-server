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
        let users = await this.prisma.user.findMany({
            take: 1000,
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

        do {
            // users = await this.prisma.user.findMany({
            //     take: 1000,
            //     orderBy: {
            //         id: 'asc'
            //     },
            //     include: {
            //         followingTags: true
            //     }
            // });
        } while (1);

    }

    /**
     * function for adding jobs to the email queue
     * @param users 
     */
    async addJobs(users: (User & {
        followingTags: {
            Tag: Tag
        }[]
    })[]){
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
                tags: tags
            },
            {
                removeOnComplete: true
            });
        }
    }
}
