import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { PersonModule } from 'src/person/person.module';
@Module({
    imports: [RegisterModule, PersonModule]
})
export class AppModule {}
