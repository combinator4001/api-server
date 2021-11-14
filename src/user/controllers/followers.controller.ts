import { Controller, Delete, Get, HttpException, HttpStatus, Param, Request, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GetFollowersResDto } from "../dtos/follow-dtos/get-followers-res.dto";
import { FollowersService } from "../services/followers.service";

@Controller('')
@ApiTags('User / Followers')
export class FollowersController{
    constructor(private followersService : FollowersService){}

    @Get(':username/followers')
    @ApiOperation({summary: 'Returns the given username followers.'})
    async getFollowers(@Param('username') username : string) {
        const result = await this.followersService.getFollowers(username);

        if(result === null){
            //400
            throw new HttpException({
                statusCode : HttpStatus.BAD_REQUEST,
                message : "Requested username doesn’t exist!"
            }, HttpStatus.BAD_REQUEST)
        }

        return new GetFollowersResDto(result);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/followers')
    @ApiOperation({ summary: 'User removes another user from his/her followers.' })
    @ApiHeader({name : 'Authorization'})
    removeFollower(){

    }
}