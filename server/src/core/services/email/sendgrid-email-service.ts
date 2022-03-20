import sgMail from "@sendgrid/mail";
import { createExternalServiceError } from "../../error";
import { IEmailService } from "./types";

export interface SendGridEmailArgs {
    /**
     * SendGrid API Key
     */
    apiKey: string;
    /**
     * The (verified) sender email address
     */
    sender: string;
}

export class SendGridEmailService implements IEmailService {
    private sender: string;

    constructor(args: SendGridEmailArgs) {
        sgMail.setApiKey(args.apiKey);
        this.sender = args.sender;
    }

    async sendEmail(to: string, message: string, subject: string): Promise<void> {
        try {
            const msg = {
                to,
                from: this.sender,
                html: message,
                subject
            };

            await sgMail.send(msg);
        }
        catch(e) {
            throw createExternalServiceError(e, 'SendGrid');
        }
    }
}