import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService]
})
export class PersonModule {}
