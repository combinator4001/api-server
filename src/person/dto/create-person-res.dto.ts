import { ApiProperty } from "@nestjs/swagger";

export class CreatePersonUnauthorizedResDto {
    @ApiProperty({ default : 401})
    statusCode : number;
    @ApiProperty({default : 'Username already exists.'})
    message : string;
}

export class CreatePersoBadRequestResDto {
    @ApiProperty({ default : 400})
    statusCode : number;
    @ApiProperty({example : ["message 1", "mesage 2"]})
    message : string;
    @ApiProperty({default : 'Bad Request'})
    error: string;
}

