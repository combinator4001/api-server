import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "src/app/prisma.service";
import { JwtAuthGuard } from "src/auth/general/jwt-auth.guard";
import { GetFollowersResDto } from "../dtos/follow-dtos/get-followers-res.dto";
import { RemoveFollowerReqDto } from "../dtos/follow-dtos/remove-follower-req.dto";
import { FollowersService } from "../services/followers.service";

@Controller('')
@ApiTags('Followers')
export class FollowersController{
    constructor(
        private followersService: FollowersService,
        private prisma: PrismaService
    ){}

    @Get(':username/followers')
    @ApiOperation({summary: 'Returns the given username followers.'})
    @ApiOkResponse({
        type: GetFollowersResDto
    })
    @ApiBadRequestResponse({description : 'Requested username doesn’t exist!'})
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
    @ApiOkResponse({description: "Removed!"})
    @ApiBadRequestResponse({description: 
        `\n
        Invalid Field!\n
        Username not found!\n
        `
    })
    async removeFollower(@Request() req, @Body() body: RemoveFollowerReqDto){
        const follower = await this.prisma.user.findUnique({
            where: {
                username: body.usernameToUnfollow
            }
        });

        if(!follower){
            throw new BadRequestException("Username not found!");
        }

        if(follower.id === req.user.id){
            throw new BadRequestException("Can’t remove yourself!");
        }

        await this.prisma.user.update({
            where : {id : req.user.id},
            data : {
                followedBy : {
                    disconnect : {
                        // id : unfollowUser.id
                        username: body.usernameToUnfollow
                    }
                }
            }
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Removed!"
        };
    }
}