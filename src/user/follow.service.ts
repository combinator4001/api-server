import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/app/prisma.service";

@Injectable()
export class FollowService{
    constructor(private prisma : PrismaService){}

    /**
     * 
     * @param username 
     * @returns string[] of usernames or null if requested username is not in database
     */
    async getFollowing(username : string) : Promise< null | string[] >{
        const user = await this.prisma.user.findUnique({
            where : {
                username : username
            },
            include : {
                following : true
            }
        })
        
        if(!user) return null;

        const following = user.following.map( user => user.username );
        return following;
    }

}