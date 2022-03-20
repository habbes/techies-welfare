import { ISmsService } from "./types";

export class LocalSmsService implements ISmsService {
    sendSms(to: string, message: string): Promise<void> {
        console.log(`SENDING SMS to: ${to}\n${message}\n\n`);
        return Promise.resolve();
    }
}
