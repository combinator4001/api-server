import { Injectable } from "@nestjs/common";
import { basename, join } from "path";
import { PrismaService } from "src/app/prisma.service";
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
import * as dotenv from 'dotenv';
import { Blog, Company, Person, Role, User } from "@prisma/client";
import { GetBlogsDto } from "../dtos/get-blogs.dto";
dotenv.config();

@Injectable()
export class ProfileService{
    constructor(private prisma : PrismaService){}

    /**
     * Uploads the image to the storage.
     * @param fullImagePath 
     */
    async uploadImage(fullImagePath : string){
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
            Bucket: 'combinator-profile-images', // bucket name
            Key: 'object-name', // the name of the selected file
            ACL: 'public-read', // 'private' | 'public-read'
            Body: 'BODY',
        };

        // BODY (the contents of the uploaded file - leave blank/remove to retain contents of original file.)
        //FILE_NAME (the name of the file to upload (if you don't specify KEY))
        const fullFilePath = fullImagePath;

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
    }

    /**
     * updates image url in database.
     * @param userId 
     * @param imageUrl 
     */
    async updateImageUrl(userId, imageUrl){
        await this.prisma.user.update({
          where : {
            id : userId
        },
        data : {
            imageUrl : imageUrl
          }
        })
    }

    async deletePreviousImage(userId : number){
        // Create an S3 client service object
        const s3 = new S3Client({
            region: 'default',
            endpoint: process.env.endpoint as string,
            credentials: {
                accessKeyId: process.env.accessKey as string,
                secretAccessKey: process.env.secretKey as string,
            }
        });

        const resultUser = await this.prisma.user.findUnique({
            where : {
                id : userId
            }
        });

        if(!resultUser.imageUrl) return;

        // call S3 to retrieve upload file to specified bucket
        const run = async () => {
            try {
                const data = await s3.send(
                    new DeleteObjectCommand({
                        Bucket: 'combinator-profile-images',
                        Key: basename(resultUser.imageUrl)
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
   * finds an unique user by the given username.
   * @param username 
   * @returns User or null
   */
	async findUserById(id : number) : Promise< User | null > {
        const user = await this.prisma.user.findUnique({
          where : {
            id : id
          }
        })
    
        if(!user) return null;
    
        return user;
    }

    async deleteAccount(id : number){
        const follow = this.prisma.user.update({
          where : {
            id : id
          },
          data : {
            following : {
              set : []
            },
            followedBy : {
              set : []
            }
          }
        });
        const deleteUser = this.prisma.user.delete({
          where : {
            id : id
          }
        });
        const transaction = await this.prisma.$transaction([follow, deleteUser]);
        //change behaviour to cascade
    }

    async getProfileById(id: number){
        const user = await this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                person: true,
                company: true
            }
        });
        if(!user) return null;
        return user;
    }

    async getProfileByUsername(username: string){
        const user = await this.prisma.user.findUnique({
            where: {
                username
            },
            include:{
                person: true,
                company: true
            }
        });
        if(!user) return null;
        return user;
    }

    async getUserByUsername(username: string): Promise<User | null>{
        const user = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        if(!user) return null;
        return user;
    }

    async getBlogsList(authorId: number){
        const blogs : Blog[] = await this.prisma.blog.findMany({
            where: {
                author_id: authorId
            }
        });
        const result = blogs.map(blog => new GetBlogsDto(
                blog.id,
                blog.title,
                blog.estimatedMinutes,
                blog.createdAt,
                blog.lastModify
            )
        );
        return result;
    }

    async userFollowedTags(userId: number){
        return await this.prisma.followTag.findMany({
          where: {
            userId: userId
          },
          include: {
            Tag: true
          }
        });
    }
}