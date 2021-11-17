import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService{
    private transporter : any;
    private host : string;
    private user : string;
    private pass : string;
    private from : string;

    constructor(){
        this.host = process.env.TRANSPORTER_HOST as string;
        this.user = process.env.AUTH_USER as string;
        this.pass = process.env.AUTH_PASS as string;
        this.from = `"Combinator" ${this.user}`;

        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: this.user, // generated ethereal user
                pass: this.pass, // generated ethereal password
            },
        });
    }

    async sendOneMail(email : string, subject : string, htmlBody : string){
        // send mail with defined transport object
        let info = await this.transporter.sendMail({
            from: this.from, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: "This is combinator", // plain text body
            html: htmlBody, // html body
        });

        console.log("Message sent: %s", info.messageId);
    }
}