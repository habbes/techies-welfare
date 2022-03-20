export interface IEmailService {
    sendEmail(to: string, message: string, subject: string): Promise<void>;
}