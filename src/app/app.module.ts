import { Module } from '@nestjs/common';
import { PersonModule } from 'src/person/person.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { GlobalModule } from './global.module';
@Module({
    imports : 
        [
            GlobalModule,
            UserModule,
            PersonModule,
            CompanyModule
        ]
})
export class AppModule {}
