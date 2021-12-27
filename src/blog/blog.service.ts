import { Injectable } from '@nestjs/common';
import { basename, join } from 'path';
import { PrismaService } from 'src/app/prisma.service';
const fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
import * as dotenv from 'dotenv';
import { Blog } from '.prisma/client';
import { UpdateBlogReqDto } from './dtos/update-blog-req.dto';
import { blogStorageUrl } from 'src/variables';
dotenv.config();

@Injectable()
export class BlogService {
    constructor(private prisma : PrismaService){}

    createLocalHtml(content : string) : string{
        const blogsFolderPath : string = join(process.cwd(), 'temp/blogs');
        if (!fs.existsSync(blogsFolderPath)) {
            fs.mkdirSync(blogsFolderPath, {
                recursive: true
            });
        }
        const fileName : string = uuidv4() + '.html';
        const fullFilePath = blogsFolderPath + '/' + fileName;
        fs.writeFileSync(fullFilePath, content);
        return fullFilePath;
    }

    async sendToStorage(fullBlogPath : string){
        // Create an S3 client service object
        const s3 = new S3Client({
            region: 'default',
            endpoint: process.env.endpoint as string,
            credentials: {
                accessKeyId: process.env.accessKey as string,
                secretAccessKey: process.env.secretKey as string,
            }
        });

        const uploadParams = {
            Bucket: 'combinator-blogs', // bucket name
            Key: 'object-name', // the name of the selected file
            ACL: 'public-read', // 'private' | 'public-read'
            Body: 'BODY',
        };

        // BODY (the contents of the uploaded file - leave blank/remove to retain contents of original file.)
        //FILE_NAME (the name of the file to upload (if you don't specify KEY))
        const fullFilePath = fullBlogPath;

        // call S3 to retrieve upload file to specified bucket
        const run = async () => {
            // Configure the file stream and obtain the upload parameters
            const fileStream = fs.createReadStream(fullFilePath);
            fileStream.on('error', function (err) {
                console.log('File Error', err);
            });
            uploadParams.Key = basename(fullFilePath);
            // call S3 to upload file to specified bucket
            uploadParams.Body = fileStream;

            try {
                const data = await s3.send(new PutObjectCommand(uploadParams));
                console.log('Success', data);
            } catch (err) {
                console.log('Error', err);
            }
        };

        await run();
        this.deleteLocalHtml(fullBlogPath);
    }

    private deleteLocalHtml(fullBlogPath : string){
        try {
            fs.unlinkSync(fullBlogPath);
        } catch (err) {
            console.error(err);
        }
    }

    async createBlog(
        authorId : number, 
        estimatedMinutes : number, 
        title : string,
        contentUrl : string,
        tagIds: number[]
    ){
        const relations = tagIds.map((id: number) => {return {tag_id: id}});
        await this.prisma.blog.create({
            data : {
                estimatedMinutes,
                title,
                contentUrl,
                author : {
                    connect : {
                        id : authorId
                    }
                },
                tags: {
                    createMany: {
                        data: relations
                    }
                }
            }
        });
    }

    async getBlog(blogId: number){
        const blog = await this.prisma.blog.findUnique({
            where: {
                id: blogId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                tags: {
                    select: {
                        tag_id: true,
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return blog;
    }

    async userIsAuthorized(userId: number, blogId: number): Promise<Boolean>{
        const blog = await this.getBlog(blogId);
        if(!blog) return false;
        return blog.author.id === userId;
    }

    async updateBlog(blogId: number, updateBlogReqDto: UpdateBlogReqDto){
        const oldBlog: Blog = await this.prisma.blog.findUnique({
            where: {
                id: blogId
            }
        });

        if(updateBlogReqDto.content){
            const fullBlogPath = this.createLocalHtml(updateBlogReqDto.content);
            this.sendToStorage(fullBlogPath);
            const contentUrl = blogStorageUrl + '/' + basename(fullBlogPath);
            await this.deleteFromStorage(blogId);
            await this.prisma.blog.update({
                where: {
                    id: blogId
                },
                data: {
                    lastModify: new Date(),
                    estimatedMinutes: updateBlogReqDto.estimatedMinutes ?? oldBlog.estimatedMinutes,
                    title: updateBlogReqDto.title ?? oldBlog.title,
                    contentUrl: contentUrl
                }
            });
        }else{
            await this.prisma.blog.update({
                where: {
                    id: blogId
                },
                data: {
                    lastModify: new Date(),
                    estimatedMinutes: updateBlogReqDto.estimatedMinutes ?? oldBlog.estimatedMinutes,
                    title: updateBlogReqDto.title ?? oldBlog.title
                }
            });
        }

        if(updateBlogReqDto.tagIds){
            await this.prisma.tagsOnBlogs.deleteMany({
                where: {
                    blog_id: blogId
                }
            });
            const relations = updateBlogReqDto.tagIds.map((id: number) => {
                return {
                    blog_id: blogId,
                    tag_id: id
                };
            });
            await this.prisma.tagsOnBlogs.createMany({
                data: relations
            });
        }
    }

    async deleteBlog(blogId: number){
        await this.deleteFromStorage(blogId);
        await this.prisma.blog.delete({
            where: {
                id: blogId
            }
        });
    }

    private async deleteFromStorage(blogId : number){
        // Create an S3 client service object
        const s3 = new S3Client({
            region: 'default',
            endpoint: process.env.endpoint as string,
            credentials: {
                accessKeyId: process.env.accessKey as string,
                secretAccessKey: process.env.secretKey as string,
            }
        });

        const blog = await this.prisma.blog.findUnique({
            where : {
                id : blogId
            }
        });

        // call S3 to retrieve upload file to specified bucket
        const run = async () => {
            try {
                const data = await s3.send(
                    new DeleteObjectCommand({
                        Bucket: 'combinator-blogs',
                        Key: basename(blog.contentUrl)
                    })
                );
                console.log('Success', data);
            } catch (err) {
                console.log('Error', err);
            }
        };

        run();

    }

    /**
     * 
     * @param page 
     * @param limit 
     * @param orCondition 
     * @returns 
     */
    async findManyByTags(
        page: number,
        limit: number,
        orCondition: {
            tag_id: number
        }[]
    ){
        const skip = (page - 1) * limit;
        const take = limit;
        return await this.prisma.tagsOnBlogs.findMany({
            where: {
                OR: orCondition
            },
            distinct: ['blog_id'],
            include: {
                blog: {
                    include: {
                        author: {
                            select: {
                                username: true
                            }
                        },
                        tags: {
                            select: {
                                tag: true
                            }
                        }
                    }
                }
            },
            skip: skip,
            take: take
        });
    }
}
