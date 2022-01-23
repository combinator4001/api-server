import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/app/prisma.service";

@Injectable()
export class FollowingService{
    constructor(private prisma : PrismaService){}

    /**
     * get following list
     * @param username 
     * @returns string[] of usernames or null if the requested username is not in the database
     */
    async getFollowing(username : string) : Promise< string[] | null >{
        const user : User & { following : User[] } = await this.prisma.user.findUnique({
            where : {
                username : username
            },
            include : {
                following : true
            }
        })
        
        if(!user) return null;

        const following = user.following.map( (user : User) => user.username );
        return following;
    }

    /**
    * Follows another user.
    * @param id 
    * @param followingUsername 
    * @returns 201, 400, 401
    */
    async follow(id : number, followingUsername : string){
        const user = await this.prisma.user.findUnique({
            where : {
                id : id
            }
        });

        if(!user){
            // 401
            // malicious payload
            throw new HttpException({
                statusCode : HttpStatus.UNAUTHORIZED,
                message : 'Unauthorized!'
            }, HttpStatus.UNAUTHORIZED);  
        }

        const following = await this.prisma.user.findUnique({
            where : {
                username : followingUsername
            }
        });

        if(!following){
            // no one to follow
            throw new BadRequestException('followingUsername not found!');
        }

        if(following.id === id){
            throw new BadRequestException('Can’t follow yourself!');
        }

        try{
            const result = await this.prisma.user.update({
                where : {id : user.id},
                data : {
                    following : {
                        connect : {
                            id : following.id
                        }
                    }
                }
            });

            if(result){
                //201
                return {
                    statusCode : HttpStatus.CREATED,
                    message : 'Followed!'
                }
            }
        }catch{
            throw new BadRequestException("Already Following!");
        }
    }

    /**
   * Unfollows another user.
   * @param id 
   * @param unfollowUsername 
   * @returns 
   */
    async unfollow(id : number, unfollowUsername : string){
        const user = await this.prisma.user.findUnique({
            where : {
                id : id
            }
        });

        if(!user){
            // 401
            // malicious payload
            throw new HttpException({
                statusCode : HttpStatus.UNAUTHORIZED,
                message : 'Unauthorized!'
            }, HttpStatus.UNAUTHORIZED);  
        }

        const unfollowUser = await this.prisma.user.findUnique({
            where : {
                username : unfollowUsername
            }
        });

        if(!unfollowUser){
            // no one to unfollow
            throw new BadRequestException('unfollowUsername not found!');
        }

        if(unfollowUser.id === id){
            throw new BadRequestException('Can’t unfollow yourself!');
        }

        try{
            const result = await this.prisma.user.update({
                where : {id : user.id},
                data : {
                    following : {
                    disconnect : {
                        id : unfollowUser.id
                    }
                    }
                }
            });

            if(result){
            //200
            return {
                statusCode : HttpStatus.OK,
                message : 'Unfollowed!'
            };
        }
        }
        catch{
            throw new BadRequestException("Not following to unfollow!");
        }
    }
}