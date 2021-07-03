const createClient = require("africastalking");
import { SmsService, SendArgs, Client } from "africastalking-types";
import { ISmsService } from "./types";

export interface AtSmsServiceArgs {
    username: string;
    apiKey: string;
    sender: string;
};

export class AtSmsService implements ISmsService {
    private client: Client;
    private service: SmsService;
    private sender: string;

    constructor(args: AtSmsServiceArgs) {
        this.client = createClient({ username: args.username, apiKey: args.apiKey });
        this.service = this.client.SMS;
        this.sender = args.sender;
    }

    async sendSms(to: string, message: string): Promise<void> {
        const args: SendArgs = {
            to: [to],
            message
        };

        if (this.sender) {
            args.from = this.sender;
        }

        try {
            const res = await this.service.send(args);

            if (res.SMSMessageData.Recipients[0].status !== 'Success') {
                throw new Error('Failed to send message');
            }
        }
        catch (e) {
            throw e;
        }
    }
}