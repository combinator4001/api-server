import { Body, Request, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Delete } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/general/jwt-auth.guard";
import { UnfollowReqDto } from "../dtos/follow-dtos/unfollow-req.dto";
import { FollowReqDto } from "../dtos/follow-dtos/follow-req.dto";
import { GetFollowingResDto } from "./../dtos/follow-dtos/get-following-res.dto";
import { FollowingService } from "./../services/following.service";

@Controller('')
@ApiTags('Following')
export class FollowingController{
    constructor(private followingService : FollowingService){}

    @Get(':username/following')
    @ApiOperation({summary: 'Returns the given username following.'})
    @ApiOkResponse({
        description : 'Returns array of usernames which are strings.',
        type : GetFollowingResDto
    })
    @ApiBadRequestResponse({description : 'Requested username doesn’t exist!'})
    async getFollowing(@Param('username') username : string) {
        const result = await this.followingService.getFollowing(username);

        if(result === null){
            //400
            throw new HttpException({
                statusCode : HttpStatus.BAD_REQUEST,
                message : "Requested username doesn’t exist!"
            }, HttpStatus.BAD_REQUEST)
        }

        return new GetFollowingResDto(result);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/following')
    @ApiHeader({name : 'Authorization'})
    @ApiOperation({ summary: 'User follows another user.' })
    @ApiCreatedResponse({ description : 'Followed successfully!'})
    // BadRequest : 1.Already followed 2.followingUsername not found
    @ApiBadRequestResponse({description : 
        `\n
        Empty field!\n
        followingUsername not found.\n
        Can’t follow yourself!\n
        Already Following!\n
        `
    })
    // Unauthorized : 1.invalid jwt, 2.malicious payload(user not found)
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    follow(@Request() req, @Body() followReqDto : FollowReqDto){
      //req.user is the payload which we have received.
      return this.followingService.follow(req.user.id, followReqDto.followingUsername);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/following')
    @ApiOperation({ summary: 'User unfollows another user.' })
    @ApiHeader({name : 'Authorization'})
    @ApiOkResponse({ description : 'Unfollowed successfully!'})
    @ApiBadRequestResponse({description : 
        `\n
        unfollowUsername not found.\n
        Empty field!\n
        Can’t unfollow yourself!\n
        Not following to unfollow!\n
        `
    })
    @ApiUnauthorizedResponse({description : 'Unauthorized!'})
    unFollow(@Request() req, @Body() unfollowReqDto : UnfollowReqDto){
        return this.followingService.unfollow(req.user.id, unfollowReqDto.unfollowUsername);
    }
}