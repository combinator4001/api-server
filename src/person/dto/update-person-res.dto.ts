import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Person, Role, User } from '@prisma/client';

export class UpdatePersonResDto{
    @ApiProperty({ default : 200})
    // 1.
    private statusCode : number;

    @ApiProperty({default : 'Profile updated.'})
    // 2.
    private message : string;

    @ApiProperty()
    // 3.
    username: string;

    @ApiProperty()
    // 4.
    firstName : string;
    
    @ApiProperty()
    // 5.
    lastName : string;

    @ApiProperty()
    // 6.
    email: string;

    @ApiProperty({example : false})
    // 7.
    showEmail : boolean;

    @ApiProperty()
    // 8.
    bio: string;

    constructor(userPart : User, personPart : Person){
        const {username, role, email, showEmail, bio} = userPart;
        const {firstName, lastName} = personPart;
        this.statusCode = 200;
        this.message = 'Profile updated.';
        this.username = username;
        this.email = email;
        this.showEmail = showEmail;
        this.bio = bio;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
