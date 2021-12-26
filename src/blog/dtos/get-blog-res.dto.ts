import { ApiProperty } from "@nestjs/swagger"

class Tag{
    @ApiProperty()
    id: number
    
    @ApiProperty()
    name: string
}

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

    @ApiProperty({
        type: Tag,
        isArray: true
    })
    tags : Tag[]

    constructor(
        id : number,
        title : string,
        authorUsername : string,
        estimatedMinutes : number,
        createdAt : Date,
        lastModify : Date,
        contentUrl : string,
        tags : Tag[]
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