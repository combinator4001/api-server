import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { RegisterRepository } from './register.repository';

@Module({
    controllers :[RegisterController],
    providers : [RegisterService, RegisterRepository]
})
export class RegisterModule {}
