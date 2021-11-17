import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
