import { ApiProperty } from "@nestjs/swagger";

export class GetFollowingResDto {
    @ApiProperty({default : 200})
    private statusCode : number;

    @ApiProperty({
        example : [
            'username1',
            'username2',
            'username3'
        ]
    })
    following : string[]

    constructor(following : string[]){
        this.statusCode = 200;
        this.following = following;
    }
}