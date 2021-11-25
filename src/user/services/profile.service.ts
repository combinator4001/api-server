import { Injectable } from "@nestjs/common";
import { basename, join } from "path";
import { PrismaService } from "src/app/prisma.service";
const { S3Client, PutObjectCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ProfileService{
    constructor(private prisma : PrismaService){}

    /**
     * Uploads the image to the storage.
     * @param fullImagePath 
     */
    async updateImage(fullImagePath : string){
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

    async updateUserImagePathById(userId, imageUrl){
        await this.prisma.user.update({
          where : {
            id : userId
          },
          data : {
            imageUrl : imageUrl
          }
        })
      }
}