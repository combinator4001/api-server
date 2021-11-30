import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    @Post()
    createPost(){

    }

    @Get()
    getPost(){

    }

    @Put()
    updatePost(){

    }

    @Delete()
    deletePost(){

    }
}
