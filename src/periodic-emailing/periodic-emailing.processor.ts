import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('MonthlyMails')
export class PeriodicEmailingProcessor {
  private readonly logger = new Logger(PeriodicEmailingProcessor.name);

  @Process()
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }
}