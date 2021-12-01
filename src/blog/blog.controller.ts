import { Body, Controller, Delete, Get, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { basename } from 'path';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { blogStorageUrl } from 'src/variables';
import { BlogService } from './blog.service';
import { CreatePostDto } from './create-post.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(private blogService : BlogService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiHeader({name : 'Authorization'})
    @ApiCreatedResponse({description : 'Posted!'})
    @ApiBadRequestResponse({description : 'Invalid fields!'})
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async createBlog(@Body() body : CreatePostDto, @Request() req){

        const fullBlogPath = this.blogService.createLocalHtml(body.content);
        this.blogService.sendToStorage(fullBlogPath);
        const contentUrl = blogStorageUrl + '/' + basename(fullBlogPath);
        await this.blogService.createBlog(
            req.user.id,
            body.estimatedMinutes,
            body.title,
            contentUrl
        );

        return {
            statusCode : 201,
            message : 'Posted!'
        }
    }

    @Get(':id')
    getBlog(){

    }

    @Put(':id')
    updateBlog(){

    }

    @Delete(':id')
    deleteBlog(){

    }
}
