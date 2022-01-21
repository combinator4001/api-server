import { Module } from '@nestjs/common';
import { BlogModule } from 'src/blog/blog.module';
import { InvestModule } from 'src/invest/invest.module';
import { PersonModule } from 'src/person/person.module';
import { TagModule } from 'src/tag/tag.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { GlobalModule } from './global.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PeriodicEmailingModule } from 'src/periodic-emailing/periodic-emailing.module';
import { BullModule } from '@nestjs/bull';

@Module({
    imports : [
        GlobalModule,
        UserModule,
        PersonModule,
        CompanyModule,
        BlogModule,
        TagModule,
        InvestModule,
        PeriodicEmailingModule,
        ScheduleModule.forRoot(),
        BullModule.forRoot({
            redis: {
              host: 'localhost',
              port: 6379,
            },
        })
    ]
})
export class AppModule {}
