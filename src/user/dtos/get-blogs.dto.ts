import { ApiProperty } from "@nestjs/swagger"

export class GetBlogsDto{
    @ApiProperty()
    id: number

    @ApiProperty()
    title: string

    @ApiProperty()
    estimatedMinutes: number

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    lastModify: Date

    constructor(
        id: number,
        title: string,
        estimatedMinutes: number,
        createdAt: Date,
        lastModify: Date,
    ){
        this.id = id;
        this.title = title;
        this.estimatedMinutes = estimatedMinutes;
        this.createdAt = createdAt;
        this.lastModify = lastModify;
    }
}