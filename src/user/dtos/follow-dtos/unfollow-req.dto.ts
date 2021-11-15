import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UnfollowReqDto {
    @ApiProperty({description : 'Username for the user who you want to unfollow.'})
    @IsString()
    public unfollowUsername : string;
}