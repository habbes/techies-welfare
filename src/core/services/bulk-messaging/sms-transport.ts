import { ISmsService } from "../sms";
import { IUser } from "../../models";
import { IMessageTransport } from "./types";

export interface SmsMessageTransportArgs {
    smsService: ISmsService;
}

export class SmsMessageTransport implements IMessageTransport {
    constructor(private args: SmsMessageTransportArgs) {}

    sendMessage(recipient: IUser, message: string): Promise<void> {
        return this.args.smsService.sendSms(recipient.phone, message);
    }
}