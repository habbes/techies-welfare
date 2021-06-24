export interface ISmsService {
    sendSms(to: string, message: string): Promise<void>;
}