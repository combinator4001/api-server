import { Body, Controller, Delete, Get, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { BlogService } from './blog.service';
import { CreatePostDto } from './create-post.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(private blogService : BlogService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    creatBlog(@Body() body : CreatePostDto, @Request() req){

    }

    @Get()
    getBlog(){

    }

    @Put()
    updateBlog(){

    }

    @Delete()
    deleteBlog(){

    }
}
