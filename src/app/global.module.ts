import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';
@Global()
@Module({
    providers : [
        PrismaService,
        EmailService
    ],
    exports : [
        PrismaService,
        EmailService
    ]
})
export class GlobalModule {}
