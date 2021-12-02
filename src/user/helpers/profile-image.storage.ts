import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
const FileType = require('file-type');
import path = require('path');

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage = {
    storage : diskStorage({
        destination : './temp/profile-images',
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
};

export const isFileExtensionSafe = async (fullFilePath: string) : Promise<boolean> => {
	const result = await FileType.fromFile(fullFilePath);
    if(!result) return false;
	const isFileTypeLegit = validFileExtensions.includes(result.ext);
	const isMimeTypeLegit = validMimeTypes.includes(result.mime);
	const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
	return isFileLegit;
};

export const removeFile = (fullFilePath: string): void => {
	try {
		fs.unlinkSync(fullFilePath);
	} catch (err) {
		console.error(err);
	}
};