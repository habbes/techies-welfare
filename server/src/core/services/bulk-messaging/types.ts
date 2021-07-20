import { IUser } from "../../models";

export interface IBulkMessageService {
    send(recipients: string[], messageTemplate: string): Promise<BulkMessageReport>;
    previewMessage(messageTemplate: string): Promise<string>;
}

export interface IMessageContextFactory {
    createContextFromUser(user: IUser): Promise<MessageTemplateContext>;
}

export interface IMessageTemplateResolver {
    resolve(context: MessageTemplateContext, messageTemplate: string): Promise<string>;
}

export interface IRecipientResolver {
    canResolve(recipient: string): boolean;
    resolve(recipient: string): Promise<IUser[]>;
}

export interface IMessageTransport {
    sendMessage(recipient: IUser, message: string): Promise<void>;
}

export interface BulkMessageReport {
    numRecipients: number;
    recipients: BulkMessageReportRecipient[];
    numFailed: number;
    errors: BulkMessageReportError[];
}

export interface BulkMessageReportRecipient {
    name: string;
    user: string;
}

export interface BulkMessageReportError {
    message: string;
    recipientGroup?: string;
    user?: string;
    name?: string;
}

export interface MessageTemplateContext extends Record<string, any> {
    firstName: string;
    paymentLink: string;
    baseUrl: string;
}