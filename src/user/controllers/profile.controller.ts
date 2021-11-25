import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User')
@Controller()
export class ProfileController{
    @Get('/:username/profile')
    getProfile(){

    }

    @Get('/me/profile')
    getMyProfile(){

    }
}