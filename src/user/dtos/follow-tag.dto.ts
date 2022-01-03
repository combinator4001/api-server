import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class FollowTagReqDto{
    @ApiProperty()
    @IsInt()
    tagId: number
}