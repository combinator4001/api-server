import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangePassReqDto{
    @ApiProperty()
    @IsString()
    username : string;
}