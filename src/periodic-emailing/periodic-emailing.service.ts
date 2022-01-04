import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/app/prisma.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

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
    async addJobs() {
        const job = await this.monthlyMailsQueue.add({
            name: `job ${Date.now()}`,
        });
        this.logger.debug(`Job added, ${Date.now()}`);
    }
}
