import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { PersonModule } from 'src/person/person.module';
import { CompanyModule } from './company/company.module';
@Module({
    imports: [RegisterModule, PersonModule, CompanyModule]
})
export class AppModule {}
