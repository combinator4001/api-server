import { Body, Controller, Delete, Get, Post, UseGuards, Request, Param, NotFoundException, ParseIntPipe, Patch, UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiHeader, ApiTags, ApiOkResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { basename } from 'path';
import { PrismaService } from 'src/app/prisma.service';
import { JwtAuthGuard } from 'src/auth/general/jwt-auth.guard';
import { blogStorageUrl } from 'src/variables';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create-post.dto';
import { GetBlogResDto } from './dtos/get-blog-res.dto';
import { SearchByTag } from './dtos/search-by-tag.dto';
import { UpdateBlogReqDto } from './dtos/update-blog-req.dto';

@ApiTags('Blog')
@Controller()
export class BlogController {
    constructor(
        private blogService: BlogService,
        private prisma: PrismaService
    ){}

    @Post('blog')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary : 'Creates a new blog post.'})
    @ApiHeader({name : 'Authorization'})
    @ApiCreatedResponse({description : 'Posted!'})
    @ApiBadRequestResponse({description : 'Invalid fields!'})
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async createBlog(@Body() body : CreateBlogDto, @Request() req){
        for(const tagId of body.tagIds){
            const result = await this.prisma.tag.findUnique({
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

    @Get('blog/:id')
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

    @Patch('blog/:id')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({name : 'Authorization'})
    @ApiOperation({
        summary: 'Updates a blog post.',
        description: 'If you dont want update tags, then simply send a json without tagIds key.'
    })
    @ApiOkResponse({description: 'Updated!'})
    @ApiBadRequestResponse({description: 'Invalid fields!'})
    @ApiUnauthorizedResponse({description: 'Unauthorized!'})
    async updateBlog(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBlogReqDto, @Request() req){
        //check if the user is owner of that post
        if(!await this.blogService.userIsAuthorized(req.user.id, id)){
            throw new UnauthorizedException();
        }
        if(body.tagIds){
            for(const tagId of body.tagIds){
                const result = await this.prisma.tag.findUnique({
                    where: {
                        id: tagId
                    }
                });
                if(!result){
                    throw new BadRequestException(`There is no tag associated with ${tagId}`);
                }
            }
        }
        await this.blogService.updateBlog(id, body);
    }

    @Delete('blog/:id')
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

    @Get('blogs/search')
    @ApiOperation({summary: "Filters blogs by tags."})
    @ApiOkResponse({
        description: "Fetched successfully!",
        type: GetBlogResDto,
        isArray: true
    })
    @ApiBadRequestResponse({description: "Page and limit must be positive"})
    async searchByTag(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Body() body: SearchByTag
    ){
        //validation page and limit
        if(page <= 0 || limit <= 0){
            throw new BadRequestException('page and limit must be positive!');
        }

        //validation tags + making the query array
        const tagIds = [];
        for(const tagId of body.tagIds){
            const result = await this.prisma.tag.findUnique({
                where: {
                    id: tagId
                }
            });
            if(!result){
                throw new BadRequestException(`There is no tag associated with ${tagId}`);
            }
            else{
                tagIds.push({
                    tag_id: result.id
                });
            }
        }

        const queryResults = await this.blogService.findManyByTags(page, limit, tagIds);
        const result = queryResults.map(item => {
            const tags = item.blog.tags.map(item => {
                return {
                    id: item.tag.id,
                    name: item.tag.name
                };
            });

            return new GetBlogResDto(
                item.blog_id,
                item.blog.title,
                item.blog.author.username,
                item.blog.estimatedMinutes,
                item.blog.createdAt,
                item.blog.lastModify,
                item.blog.contentUrl,
                tags
            )
        });

        return result;
    }

    @Get('blogs/')
    @ApiOperation({summary: "Returns page of blogs for homepage."})
    @ApiOkResponse({
        description: "Fetched successfully!",
        type: GetBlogResDto,
        isArray: true
    })
    @ApiBadRequestResponse({description: 'Invalid page or limit.'})
    async getAllBlogs(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number
    ){
        //validation page and limit
        if(page <= 0 || limit <= 0){
            throw new BadRequestException('page and limit must be positive!');
        }

        const queryResults = await this.blogService.findMany(page, limit);
        const result = queryResults.map(item => {
            const tags = item.tags.map(item => {
                return {
                    id: item.tag.id,
                    name: item.tag.name
                };
            });
            return new GetBlogResDto(
                item.id,
                item.title,
                item.author.username,
                item.estimatedMinutes,
                item.createdAt,
                item.lastModify,
                item.contentUrl,
                tags
            )
        })
        return result;
    }
}
