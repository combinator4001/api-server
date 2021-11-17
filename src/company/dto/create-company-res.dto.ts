import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class CreateCompanyCreatedResDto {
    @ApiProperty({ default : 201})
    // 1.
    private statusCode : number;

    @ApiProperty({default : 'Company registered.'})
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
    name : string;
    
    @ApiProperty()
    // 7.
    email: string;

    @ApiProperty()
    // 8.
    owners : string [ ];

    @ApiProperty({example : false})
    // 9.
    showEmail : boolean;

    @ApiProperty()
    // 10.
    bio: string;

    constructor({
        access_token,
        username,
        role,
        name,
        email,
        owners,
        showEmail,
        bio
    }){
        this.statusCode = 201;
        this.message = 'Company registered.';
        this.access_token = access_token;
        this.username = username;
        this.role = role;
        this.name = name;
        this.email = email;
        this.owners = owners;
        this.showEmail = showEmail;
        this.bio = bio;
    }
}

export class CreateCompanyUnauthorizedResDto {
    @ApiProperty({ default : 401})
    statusCode : number;
    @ApiProperty({default : 'Username already exists.'})
    message : string;
}

export class CreateCompanyBadRequestResDto {
    @ApiProperty({ default : 400})
    statusCode : number;
    @ApiProperty({example : ["message 1", "mesage 2"]})
    message : string;
    @ApiProperty({default : 'Bad Request'})
    error: string;
}