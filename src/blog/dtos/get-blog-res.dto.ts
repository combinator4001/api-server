import { ApiProperty } from "@nestjs/swagger"

export class GetBlogResDto{
    @ApiProperty()
    id : number

    @ApiProperty()
    title : string

    @ApiProperty()
    authorUsername : string

    @ApiProperty()
    estimatedMinutes : number

    @ApiProperty()
    createdAt : Date

    @ApiProperty()
    lastModify : Date

    @ApiProperty()
    contentUrl : string

    @ApiProperty()
    tags : string[]

    constructor(
        id : number,
        title : string,
        authorUsername : string,
        estimatedMinutes : number,
        createdAt : Date,
        lastModify : Date,
        contentUrl : string,
        tags : string[]
    ){
        this.id = id;
        this.title = title;
        this.authorUsername = authorUsername;
        this.estimatedMinutes = estimatedMinutes;
        this.createdAt = createdAt;
        this.lastModify = lastModify;
        this.contentUrl = contentUrl;
        this.tags = tags;
    }
}