import { ApiProperty } from "@nestjs/swagger";

export class GetFollowersResDto {
    @ApiProperty({default : 200})
    private statusCode : number;

    @ApiProperty({
        example : [
            'username1',
            'username2',
            'username3'
        ]
    })
    followers : string[]

    constructor(followers : string[]){
        this.statusCode = 200;
        this.followers = followers;
    }
}