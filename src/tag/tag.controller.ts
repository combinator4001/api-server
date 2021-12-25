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
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
