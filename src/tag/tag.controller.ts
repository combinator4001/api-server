import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTagDto } from './dto/get-tag.dto';

@Controller('tag')
@ApiTags("Tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({summary : 'Creates a new tag with the given name.'})
  @ApiCreatedResponse({
    description: "Tag created."
  })
  @ApiBadRequestResponse({
    description: 
      `\n
      Invalid fields!\n
      Tag name already exist!\n
      `
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
  @ApiOperation({summary: 'Returns all tags.'})
  @ApiOkResponse({
    description: 'Fetched tags successfully!',
    isArray: true,
    type: GetTagDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid fields!'
  })
  async findAll(
    @Query('page', ParseIntPipe) page: number, 
    @Query('limit', ParseIntPipe) limit: number
  ){
    if(page <= 0 || limit <= 0){
      throw new BadRequestException('page and limit must be positive!');
    }
    const tags = await this.tagService.findMany(page, limit);
    const result = tags.map(tag => new GetTagDto(tag.id, tag.name));
    return result;
  }

  @Patch(':id')
  @ApiOperation({summary: "Updates name of a tag."})
  @ApiOkResponse({description: "Name changed successfully!"})
  @ApiBadRequestResponse({description: 
  `\n
    Invalid id!\n
    Invalid name!\n
  `})
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
    try{
      await this.tagService.update(id, updateTagDto.newName);
      return {
        statusCode: HttpStatus.OK,
        message: "Name changed successfully!"
      };
    }
    catch{
      throw new BadRequestException("Invalid id!");
    }
  }

  @Delete(':id')
  @ApiOperation({summary: "Deletes the tag with the given id."})
  @ApiOkResponse({description: "Tag deleted successfully!"})
  @ApiBadRequestResponse({description: "The id with the given tag, has not found!"})
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.tagService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: "Tag deleted successfully!"
      }
    } catch {
      throw new BadRequestException("The id with the given tag, has not found!");
    }
  }
}
