import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { minLength } from "class-validator";
import exp from "constants";

export class LoginPersonResDto {
    @ApiProperty({ default : 201})
    // 1.
    private statusCode : number;

    @ApiProperty({default : 'Logged in.'})
    // 2.
    private message : string;

    @ApiProperty({description : 'jwt'})
    // 3.
    access_token : string;

    @ApiProperty()
    // 4.
    username: string;

    @ApiProperty()
    // 5.
    role: Role;

    @ApiProperty()
    // 6.
    firstName : string;
    
    @ApiProperty()
    // 7.
    lastName : string;

    @ApiProperty()
    // 8.
    email: string;

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
        firstName,
        lastName,
        email,
        showEmail,
        bio
    }){
        this.statusCode = 201;
        this.message = 'Logged in.';
        this.access_token = access_token;
        this.username = username;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.showEmail = showEmail;
        this.bio = bio;
    }
}

export class LoginCompanyResDto {
    @ApiProperty({ default : 201})
    // 1.
    private statusCode : number;

    @ApiProperty({default : 'Logged in.'})
    // 2.
    private message : string;

    @ApiProperty({description : 'jwt'})
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
    owners : string[];

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
        this.message = 'Logged in.';
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

export class FailedLoginDto{
    @ApiProperty({default : 401})
    statusCode: number;

    @ApiProperty({default : "Unauthorized"})
    message : string;
}