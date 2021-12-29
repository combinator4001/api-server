import { ApiProperty } from "@nestjs/swagger"
import { InvestState } from "@prisma/client" 

export class GetInvest{
    @ApiProperty()
    subject: string

    @ApiProperty()
    message: string

    @ApiProperty()
    state: InvestState

    @ApiProperty()
    money: number

    @ApiProperty()
    senderUsername: string

    @ApiProperty()
    receiverUsername: string
}