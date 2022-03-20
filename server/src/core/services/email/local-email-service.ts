import { IEmailService } from "./types";

export class LocalEmailService implements IEmailService {
    sendEmail(to: string, message: string, subject: string): Promise<void> {
        console.log('SENDING EMAIL TO:', to);
        console.log('Subject:', subject);
        console.log(`Message: ${message}\n\n`);

        return Promise.resolve();
    }
}