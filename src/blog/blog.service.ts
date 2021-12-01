import { Injectable } from '@nestjs/common';
import { basename, join } from 'path';
import { PrismaService } from 'src/app/prisma.service';
const fs = require('fs');
import { v4 as uuidv4 } from 'uuid';
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
import * as dotenv from 'dotenv';
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
        contentUrl : string){

        await this.prisma.blog.create({
            data : {
                estimatedMinutes,
                title,
                contentUrl,
                author : {
                    connect : {
                        id : authorId
                    }
                }
            }
        })
    }    
}
