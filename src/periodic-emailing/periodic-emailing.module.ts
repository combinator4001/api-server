import { Module } from '@nestjs/common';
import { PeriodicEmailingService } from './periodic-emailing.service';
import { BullModule } from '@nestjs/bull';
import { PeriodicEmailingProcessor } from './periodic-emailing.processor';
import { PeriodicEmailingController } from './periodic-emailing.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'MonthlyMails',
    })
  ],
  controllers: [
    PeriodicEmailingController
  ],
  providers: [
    PeriodicEmailingService,
    PeriodicEmailingProcessor
  ]
})
export class PeriodicEmailingModule {}
