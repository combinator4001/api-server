import { Module } from '@nestjs/common';
import { PeriodicEmailingService } from './periodic-emailing.service';
import { BullModule } from '@nestjs/bull';
import { PeriodicEmailingProcessor } from './periodic-emailing.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'MonthlyMails',
    })
  ],
  providers: [
    PeriodicEmailingService,
    PeriodicEmailingProcessor
  ]
})
export class PeriodicEmailingModule {}
