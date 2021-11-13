import { ApiProperty } from "@nestjs/swagger";

export class ImageUploadDto {
    @ApiProperty({ type: 'file', format: '\nimage/png, image/jpg, image/jpeg' })
    image: any;
}