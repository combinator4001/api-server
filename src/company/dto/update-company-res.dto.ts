import { ApiProperty} from '@nestjs/swagger';
import { Company, Role, User } from '@prisma/client';

export class UpdateCompanyResDto{
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
    role: Role;

    @ApiProperty()
    // 5.
    name : string;
    
    @ApiProperty()
    // 6.
    email: string;

    @ApiProperty()
    // 7.
    owners : string [ ];

    @ApiProperty({example : false})
    // 8.
    showEmail : boolean;

    @ApiProperty()
    // 9.
    bio: string;

    constructor(userPart : User, companyPart : Company){
        const {username, role, email, showEmail, bio} = userPart;
        const {name , owners} = companyPart;
        this.statusCode = 200;
        this.message = 'Profile updated.';
        this.username = username;
        this.name = name;
        this.owners = owners;
        this.email = email;
        this.showEmail = showEmail;
        this.bio = bio;
    }
}
