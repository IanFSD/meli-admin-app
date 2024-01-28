import {Injectable} from "@nestjs/common";
import {InjectSendGrid, SendGridService} from "@ntegral/nestjs-sendgrid";

@Injectable()
export class SendEmailService {
    constructor(@InjectSendGrid() private readonly client: SendGridService) {
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        const res = await this.client.send({
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            html: html
        });
        return res[0].statusCode === 202;
    }
}

