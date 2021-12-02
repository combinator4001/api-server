import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Put, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiExtraModels, ApiHeader, ApiOkResponse, ApiOperation, ApiPayloadTooLargeResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/general/jwt-auth.guard";
import { ProfileService } from "../services/profile.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from './../helpers/profile-image.storage';
import { join } from 'path';
import { ImageUploadDto } from './../dtos/image-upload.dto';
import { imageStorageUrl } from 'src/variables';
import { ImageUploadResDto } from "../dtos/image-upload-res.dto";
import { Role, User } from "@prisma/client";
import { GetPrivateCompanyProfile, GetPrivatePersonProfile } from './../dtos/get-my-profile-res.dto';

@ApiTags('User / Profile')
@Controller()
export class ProfileController{
    constructor(private profileService : ProfileService){}

    @Get('/:username/profile')
    getProfile(){

    }

    @UseGuards(JwtAuthGuard)
    @Get('/me')
    @ApiOperation({summary : 'Returns private profile inofs.'})
    @ApiHeader({name : 'Authorization'})
    @ApiExtraModels(GetPrivatePersonProfile, GetPrivateCompanyProfile)
    @ApiOkResponse({
      description: 'Profile returned!',
      schema: {
        oneOf: [
          {$ref: getSchemaPath(GetPrivatePersonProfile)},
          {$ref: getSchemaPath(GetPrivateCompanyProfile)}
        ]
      }
    })
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    async getMyProfile(@Request() req){
      const result: any = await this.profileService.getCompleteProfile(req.user.id, req.user.role);
      if(result.role === Role.PERSON){
        return new GetPrivatePersonProfile(
          result.username,
          result.email,
          result.showEmail,
          result.imageUrl,
          result.bio,
          result.role,
          result.person.firstName,
          result.person.lastName,
        );
      }
      else if(result.role === Role.COMPANY){
        return new GetPrivateCompanyProfile(
          result.username,
          result.email,
          result.showEmail,
          result.imageUrl,
          result.bio,
          result.role,
          result.company.name,
          result.company.owners
        );
      }
    }

    @UseGuards(JwtAuthGuard)
    @Put('/image')
    @HttpCode(200)
    @UseInterceptors(
      FileInterceptor('image', saveImageToStorage)
    )
    @ApiOperation({summary : 'Updates profile image.'})
    @ApiHeader({name : 'Authorization'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Attach the image file',
      type: ImageUploadDto
    })
    @ApiOkResponse({
      description : 'Profile image updated!',
      type : ImageUploadResDto
    })
    @ApiBadRequestResponse({description : 'File must be a png, jpg/jpeg. |  Invalid file.'})
    @ApiPayloadTooLargeResponse({description : 'File too large. File should be less than 300KiB.'})
    async updateImage(@UploadedFile() file: Express.Multer.File, @Request() req){
      const fileName = file?.filename;
      
      if(!fileName){
        //400
        //wrong file extension
        throw new HttpException({
          statusCode : HttpStatus.BAD_REQUEST,
          message : 'File must be an iamge in png, jpg/jpeg format!'
        }, HttpStatus.BAD_REQUEST);
      }
      else{
        //file extension name is correct 
        //but needs to be checked if it is safe or not
  
        const imagesFolderPath = join(process.cwd(), 'temp/profile-images');
        const fullImagePath = join(imagesFolderPath + '/' + file.filename);
  
        if(await isFileExtensionSafe(fullImagePath)){
  
          //200
          await this.profileService.deletePreviousImage(req.user.id);
          await this.profileService.uploadImage(fullImagePath);
          const imageUrl = imageStorageUrl + '/' + file.filename;
          await this.profileService.updateImageUrl(req.user.id, imageUrl);  
          removeFile(fullImagePath);

          return new ImageUploadResDto(imageUrl);
        }
        else{
  
          //400
          //extension is correct but file is not valid | unsafe extension
          removeFile(fullImagePath);
          throw new HttpException({
            statusCode : HttpStatus.BAD_REQUEST,
            message : 'Invalid file!'
          }, HttpStatus.BAD_REQUEST);
        }
      }

    }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  @HttpCode(200)
  @ApiOperation({summary : 'Deletes the given username account.'})
  @ApiHeader({name : 'Authorization'})
  @ApiOkResponse({description : 'Account deleted!'})
  @ApiBadRequestResponse({description : 'User not found!'})
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  async deleteUser(@Request() req){
      const user : User = await this.profileService.findUserById(req.user.id);
      if(!user){
          //jwt is valid after removing account.
          throw new HttpException({
              statusCode : HttpStatus.BAD_REQUEST,
              message : 'User not found!'
          }, HttpStatus.BAD_REQUEST);
      }
      await this.profileService.deleteAccount(user.id);
      return {
          statusCode : 200,
          message : 'Account deleted!'
      };
  }
}