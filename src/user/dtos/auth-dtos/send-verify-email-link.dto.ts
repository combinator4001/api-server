import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendVerifyEmailLinkDto{
    @ApiProperty()
    @IsEmail()
    email : string;
}