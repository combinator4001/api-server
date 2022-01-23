import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiExtraModels, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiPayloadTooLargeResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";
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
import { GetPublicCompanyProfile, GetPublicPersonProfile } from './../dtos/get-public-profile-res.dto';
import { GetBlogsDto } from "../dtos/get-blogs.dto";
import { FollowTagReqDto } from "../dtos/follow-tag.dto";
import { PrismaService } from "src/app/prisma.service";
import { GetTagDto } from "src/tag/dto/get-tag.dto";

@ApiTags('Profile')
@Controller()
export class ProfileController{
    constructor(
      private profileService: ProfileService,
      private prisma: PrismaService
    ){}

    @Get('/:username/profile')
    @ApiOperation({summary : 'Returns public profile infos.'})
    @ApiExtraModels(GetPublicCompanyProfile, GetPublicPersonProfile)
    @ApiOkResponse({
      description: 'Profile returned!',
      schema: {
        oneOf: [
          {$ref: getSchemaPath(GetPublicCompanyProfile)},
          {$ref: getSchemaPath(GetPublicPersonProfile)}
        ]
      }
    })
    @ApiNotFoundResponse({description: 'Not found!'})
    async getProfile(@Param('username') username: string){
      const result = await this.profileService.getProfileByUsername(username);
      if(!result) throw new NotFoundException();
      if(result.role === Role.PERSON){
        return new GetPublicPersonProfile(
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
        return new GetPublicCompanyProfile(
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
    @Get('/me')
    @ApiOperation({summary : 'Returns private profile infos.'})
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
      const result = await this.profileService.getProfileById(req.user.id);
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
    @ApiUnauthorizedResponse({description: "Unauthorized!"})
    @ApiPayloadTooLargeResponse({description : 'File too large. File should be less than 300KiB.'})
    async updateImage(@UploadedFile() file: Express.Multer.File, @Request() req){
      const fileName = file?.filename;
      
      if(!fileName){
        //400
        //wrong file extension
        throw new HttpException({
          statusCode : HttpStatus.BAD_REQUEST,
          message : 'File must be an image in png, jpg/jpeg format!'
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

  @Get('/:username/blogs')
  @ApiOperation({
    summary : 'Returns written blogs of the given user.',
    deprecated: true
  })
  @ApiOkResponse({
    description: 'Fetched blogs successfully!',
    type: GetBlogsDto,
    isArray: true
  })
  @ApiNotFoundResponse({description: 'There is no user with that username.'})
  async getBlogs(@Param('username') username: string){
    const user = await this.profileService.getUserByUsername(username);
    if(!user){
      throw new NotFoundException();
    }
    return this.profileService.getBlogsList(user.id);
  }


  @Post("user/tags")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Follows a tag for a user.",
    description: "Each user can follow at most 5 tags."
  })
  @ApiHeader({name : 'Authorization'})
  @ApiCreatedResponse({
    description: "Followed tag successfully!"
  })
  @ApiBadRequestResponse({
    description: 
      `\n
      Sorry, you can’t follow more than 5 tags! \n
      Tag id is not valid. \n
      You have already followed this tag! \n
      Invalid fields(message will be shown). \n`
  })
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  async followTag(
    @Body() body: FollowTagReqDto,
    @Request() req
  ) {
    //check if tag id is valid
    const tag = await this.prisma.tag.findUnique({
      where: {
        id: body.tagId
      }
    });

    if(!tag){
      throw new BadRequestException("Tag id is not valid!");
    }

    //check number of followed tags
    const tags = await this.prisma.followTag.findMany({
      where: {
        userId: req.user.id
      }
    });

    if(tags.length === 5){
      throw new BadRequestException("Sorry, you can’t follow more than 5 tags!");
    }

    //every thing seems to be good, we can add the record
    try {
      await this.prisma.followTag.create({
        data: {
          userId: req.user.id,
          tagId: body.tagId
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException("You have already followed this tag!");
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: "Followed tag successfully!"
    };
  }

  @Get("user/tags")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Returns tags, which have been followed by the user."
  })
  @ApiHeader({name : 'Authorization'})
  @ApiOkResponse({
    description: 'Fetched tags successfully!',
    isArray: true,
    type: GetTagDto
  })
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  async followingTags(
    @Request() req
  ){
    const tags = await this.profileService.userFollowedTags(req.user.id)
    const result = tags.map(item => new GetTagDto(item.Tag.id, item.Tag.name));
    return result;
  }

  @Delete("user/tags")
  @ApiOperation({
    summary: "Unfollows a tag for the user."
  })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({name : 'Authorization'})
  @ApiOkResponse({description: "Unfollowed the tag!"})
  @ApiBadRequestResponse({
    description: 
      `\n
      Tag id is not valid. \n
      You haven’t followed this tag! \n
      Invalid fields(message will be shown). \n`
  })
  @ApiUnauthorizedResponse({description : 'Unauthorized!'})
  async unfollowTag(
    @Body() body: FollowTagReqDto,
    @Request() req
  ){
    //check if tag id is valid
    const tag = await this.prisma.tag.findUnique({
      where: {
        id: body.tagId
      }
    });

    if(!tag){
      throw new BadRequestException("Tag id is not valid!");
    }
    
    try {
      await this.prisma.followTag.deleteMany({
        where: {
          AND: [
            { userId: req.user.id },
            { tagId: body.tagId }
          ]
        }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException("You haven’t followed this tag!");
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: "Unfollowed the tag!"
    };
  }
}