import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';

@Injectable()
export class BlogService {
    constructor(private prisma : PrismaService){}
}
