import { ISmsService } from "../sms";
import { IUser } from "../../models";
import { IMessageTransport } from "./types";
import { IEmailService } from "../email";

export interface SmsMessageTransportArgs {
    smsService: ISmsService;
}

export class SmsMessageTransport implements IMessageTransport {
    constructor(private args: SmsMessageTransportArgs) {}

    sendMessage(recipient: IUser, message: string, subject: string): Promise<void> {
        return this.args.smsService.sendSms(recipient.phone, message);
    }
}

export interface EmailMessageTransportArgs {
    emailService: IEmailService;
}

export class EmailMessageTransport implements IMessageTransport {
    constructor(private args: EmailMessageTransportArgs) {}

    sendMessage(recipient: IUser, message: string, subject: string): Promise<void> {
        return this.args.emailService.sendEmail(recipient.email, message, subject);
    }
}

export function combineMessageTransports(...transports: IMessageTransport[]): IMessageTransport {
    return {
        async sendMessage(recipient: IUser, message: string, subject: string) {
            await Promise.all(
                transports.map(transport => transport.sendMessage(recipient, message, subject))
            );
        }
    }
}