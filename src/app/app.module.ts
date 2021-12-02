import { Module } from '@nestjs/common';
import { BlogModule } from 'src/blog/blog.module';
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
            CompanyModule,
            BlogModule
        ]
})
export class AppModule {}
