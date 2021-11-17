import { User } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/app/prisma.service";

@Injectable()
export class FollowersService{
    constructor(private prisma : PrismaService){}

    /**
     * get followers list 
     * @param username 
     * @returns string[] of usernames or null if the requested username is not in the database
     */
    async getFollowers(username : string) : Promise< string[] | null >{
        const user : User & { followedBy : User[] } = await this.prisma.user.findUnique({
            where : {
                username : username
            },
            include : {
                followedBy : true
            }
        })

        if(!user) return null;

        const followers = user.followedBy.map( (user : User) => user.username);
        return followers;
    }
}