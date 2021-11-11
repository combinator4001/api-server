import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
export class CreatePersonCreatedResDto {
    @ApiProperty({ default : 201})
    // 1.
    private statusCode : number;

    @ApiProperty({default : 'Person registered.'})
    // 2.
    private message : string;

    @ApiProperty()
    // 3.
    access_token : string

    @ApiProperty()
    // 4.
    username: string;

    @ApiProperty()
    // 5.
    role: Role;

    @ApiProperty()
    // 6.
    email: string;

    @ApiProperty({example : false})
    // 7.
    showEmail : boolean;

    @ApiProperty()
    // 8.
    bio: string;

    constructor({
        access_token,
        username,
        role,
        email,
        showEmail,
        bio
    }){
        this.statusCode = 201;
        this.message = 'Person registered.';
        this.access_token = access_token;
        this.username = username;
        this.role = role;
        this.email = email;
        this.showEmail = showEmail;
        this.bio = bio;
    }
}

export class CreatePersonUnauthorizedResDto {
    @ApiProperty({ default : 401})
    statusCode : number;
    @ApiProperty({default : 'Username already exists.'})
    message : string;
}

export class CreatePersonBadRequestResDto {
    @ApiProperty({ default : 400})
    statusCode : number;
    @ApiProperty({example : ["message 1", "mesage 2"]})
    message : string;
    @ApiProperty({default : 'Bad Request'})
    error: string;
}