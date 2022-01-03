import { Module } from '@nestjs/common';
import { PeriodicEmailingService } from './periodic-emailing.service';

@Module({
  providers: [PeriodicEmailingService]
})
export class PeriodicEmailingModule {}
