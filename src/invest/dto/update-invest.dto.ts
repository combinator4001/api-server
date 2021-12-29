import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateInvestDto {
    @ApiProperty()
    @IsBoolean()
    accepted: boolean
}
