import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpStatus } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({summary : 'Creates a new tag with the given name'})
  @ApiCreatedResponse({
    description: "Tag created."
  })
  @ApiBadRequestResponse({
    description: "Invalid fields! | Tag name already exist!"
  })
  async create(@Body() createTagDto: CreateTagDto) {
    try{
      await this.tagService.create(createTagDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Tag created."
      }
    }
    catch{
      throw new BadRequestException("Tag already exist!");
    }
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
