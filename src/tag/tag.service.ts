import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma : PrismaService){}
  async create(createTagDto: CreateTagDto) {
    return await this.prisma.tag.create({
      data: {
        name: createTagDto.name
      }
    });
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
