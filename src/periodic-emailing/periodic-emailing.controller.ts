import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PeriodicEmailingService } from "./periodic-emailing.service";

@ApiTags("Test")
@Controller()
export class PeriodicEmailingController
{
    constructor(private periodicEmailingService: PeriodicEmailingService){}

    @Get("SendMails")
    async testCall() {
        this.periodicEmailingService.scheduleEmails();
    }
}