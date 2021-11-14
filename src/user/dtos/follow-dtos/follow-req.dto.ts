import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FollowReqDto {
    @ApiProperty({description : 'Username for the user who you want to follow.'})
    @IsString()
    public followingUsername : string;
}