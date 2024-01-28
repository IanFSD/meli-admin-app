import {Module} from "@nestjs/common";
import {SendEmailService} from "./send.email.service";
import {SendGridModule} from "@ntegral/nestjs-sendgrid";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        SendGridModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                apiKey: config.get('SENDGRID_API_KEY'),
            }),
            inject: [ConfigService],
        })
    ],
    providers: [SendEmailService],
    exports: [SendEmailService],
})
export class SendEmailModule {
}
