import { Role } from ".prisma/client";
import { ApiProperty } from "@nestjs/swagger";

class GetPublicProfile{
    @ApiProperty({ default : 200})
    private statusCode : number;

    @ApiProperty({default : 'Fetched profile successfully!'})
    private message : string;

    @ApiProperty()
    username: string;

    @ApiProperty({description: 'If showEmail option is false, then it will return null.'})
    email: string;

    @ApiProperty()
    imageUrl: string;

    @ApiProperty()
    bio: string;

    @ApiProperty()
    role: Role;

    constructor(
        username,
        email,
        showEmail,
        imageUrl,
        bio,
        role
    ){
        this.statusCode = 200;
        this.message = 'Fetched profile successfully!';
        this.username = username;
        this.email = showEmail ? email : null;
        this.imageUrl = imageUrl;
        this.bio = bio;
        this.role = role;
    }
}

export class GetPublicCompanyProfile extends GetPublicProfile{
    @ApiProperty()
    name: string;

    @ApiProperty()
    owners: string[];

    constructor(
        username: string,
        email: string,
        showEmail: boolean,
        imageUrl: string,
        bio: string,
        role: Role,
        name: string,
        owners: string[]
    ){
        super(
            username,
            email,
            showEmail,
            imageUrl,
            bio,
            role
        );
        this.name = name;
        this.owners = owners;
    }
}

export class GetPublicPersonProfile extends GetPublicProfile{
    @ApiProperty()
    firstName : string;
    
    @ApiProperty()
    lastName : string;

    constructor(
        username: string,
        email: string,
        showEmail: boolean,
        imageUrl: string,
        bio: string,
        role: Role,
        firstName: string,
        lastName: string
    ){
        super(
            username,
            email,
            showEmail,
            imageUrl,
            bio,
            role
        );
        this.firstName = firstName;
        this.lastName = lastName;
    }
}