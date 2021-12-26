import { Body, Controller, Delete, Get, Post, UseGuards, Request, Param, NotFoundException, ParseIntPipe, Patch, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiHeader, ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { basename } from 'path';
import { PrismaService } from 'src/app/prisma.service';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { blogStorageUrl } from 'src/variables';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create-post.dto';
import { GetBlogResDto } from './dtos/get-blog-res.dto';
import { UpdateBlogReqDto } from './dtos/update-blog-req.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(
        private blogService: BlogService,
        private prisma: PrismaService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary : 'Creates a new blog post.'})
    @ApiHeader({name : 'Authorization'})
    @ApiCreatedResponse({description : 'Posted!'})
    @ApiBadRequestResponse({description : 'Invalid fields!'})
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async createBlog(@Body() body : CreateBlogDto, @Request() req){
        for(const tagId of body.tagIds){
            const result = await this.prisma.tag.findFirst({
                where: {
                    id: tagId
                }
            });
            if(!result){
                throw new BadRequestException(`There is no tag associated with ${tagId}`);
            }
        }

        const fullBlogPath = this.blogService.createLocalHtml(body.content);
        this.blogService.sendToStorage(fullBlogPath);
        const contentUrl = blogStorageUrl + '/' + basename(fullBlogPath);
        await this.blogService.createBlog(
            req.user.id,
            body.estimatedMinutes,
            body.title,
            contentUrl,
            body.tagIds
        );

        return {
            statusCode : 201,
            message : 'Posted!'
        }
    }

    @Get(':id')
    @ApiOperation({summary : 'Returns a blog info based on the given id.'})
    @ApiOkResponse({
        description : 'Found it!',
        type : GetBlogResDto
    })
    @ApiBadRequestResponse({description : 'Invalid request!'})
    @ApiNotFoundResponse({description : 'Not found!'})
    async getBlog(@Param('id', ParseIntPipe) id: number){
        const blog = await this.blogService.getBlog(id);
        if(!blog){
            throw new NotFoundException();
        }
        const tags = blog.tags.map(item => {
            return {
                id: item.tag_id,
                name: item.tag.name
            }
        });
        return new GetBlogResDto(
            blog.id,
            blog.title,
            blog.author.username,
            blog.estimatedMinutes,
            blog.createdAt,
            blog.lastModify,
            blog.contentUrl,
            tags
        );
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({name : 'Authorization'})
    @ApiOperation({summary: 'Updates a blog post.'})
    @ApiOkResponse({description: 'Updated!'})
    @ApiBadRequestResponse({description: 'Invalid fields!'})
    @ApiUnauthorizedResponse({description: 'Unauthorized!'})
    async updateBlog(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBlogReqDto, @Request() req){
        if(!await this.blogService.userIsAuthorized(req.user.id, id)){
            throw new UnauthorizedException();
        }
        await this.blogService.updateBlog(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({name : 'Authorization'})
    @ApiOperation({summary: 'Deletes a blog post.'})
    @ApiOkResponse({description: 'Deleted!'})
    @ApiBadRequestResponse({description : 'Not a number id'})
    @ApiUnauthorizedResponse({description: 'Unauthorized!'})
    async deleteBlog(@Param('id', ParseIntPipe) id: number, @Request() req){
        if(!await this.blogService.userIsAuthorized(req.user.id, id)){
            throw new UnauthorizedException();
        }
        await this.blogService.deleteBlog(id);
    }
}
