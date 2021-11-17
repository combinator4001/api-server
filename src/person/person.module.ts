import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports : [AuthModule],
  controllers: [PersonController],
  providers: [PersonService]
})
export class PersonModule {}
