import { ApiProperty } from "@nestjs/swagger"

export class ImageUploadResDto{
    @ApiProperty({default : 200})
    statusCode : number

    @ApiProperty({default : 'Profile image updated!'})
    message : string

    @ApiProperty()
    imageUrl : string

    constructor(imageUrl : string){
        this.statusCode = 200;
        this.message = 'Profile image updated!';
        this.imageUrl = imageUrl;
    }
}