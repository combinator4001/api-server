import { Role } from ".prisma/client";
import { ApiProperty } from "@nestjs/swagger";

class GetMyProfile{
    @ApiProperty({ default : 200})
    private statusCode : number;

    @ApiProperty({default : 'Fetched profile successfully!'})
    private message : string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty({example : false})
    showEmail : boolean;

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
        this.email = email;
        this.showEmail = showEmail;
        this.imageUrl = imageUrl;
        this.bio = bio;
        this.role = role;
    }
}

export class GetPrivateCompanyProfile extends GetMyProfile{
    @ApiProperty()
    name: string;

    @ApiProperty()
    owners: string[];

    constructor(
        username: string,
        email: string,
        showEmail: string,
        imageUrl: string,
        bio: string,
        role: string,
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

export class GetPrivatePersonProfile extends GetMyProfile{
    @ApiProperty()
    firstName : string;
    
    @ApiProperty()
    lastName : string;

    constructor(
        username: string,
        email: string,
        showEmail: Boolean,
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