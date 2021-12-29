import { ApiProperty } from "@nestjs/swagger"
import { InvestState } from "@prisma/client" 

export class GetInvest{
    @ApiProperty()
    investId: number

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

    constructor(
        investId: number,
        subject: string,
        message: string,
        state: InvestState,
        money: number,
        senderUsername: string,
        receiverUsername: string
    ){
        this.investId = investId;
        this.subject = subject;
        this.message = message;
        this.state = state;
        this.money = money;
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
    }
}