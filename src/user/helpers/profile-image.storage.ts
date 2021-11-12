import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import FileType from 'file-type';
import * as path from "path";

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions : validFileExtension[] = ['png' , 'jpg' , 'jpeg'];
const validMimeTypes : validMimeType[] = ['image/png' , 'image/jpg' , 'image/jpeg'];

export const saveImageToStorage = {
    storage : diskStorage({
        destination : './files/profile-images',
        filename : (req, file, cb) => {
            const fileExtension : string = path.extname(file.originalname);
            const fileName : string = uuidv4() + fileExtension;
            cb(null, fileName);
        } 
    }),
    limits : {
        // 300Kibibyte
        fileSize : 307200
    },
    fileFilter : (req, file, cb) => {
        const allowedMimeTypes : validMimeType[] = validMimeTypes;
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    }
}