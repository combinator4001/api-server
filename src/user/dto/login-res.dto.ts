import { ApiProperty } from "@nestjs/swagger";

export class LoginResDto {
    @ApiProperty({description : 'jwt'})
    access_token : string
}
