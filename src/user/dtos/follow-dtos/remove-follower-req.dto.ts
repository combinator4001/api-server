import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RemoveFollowerReqDto{
    @ApiProperty()
    @IsString()
    usernameToUnfollow: string
}