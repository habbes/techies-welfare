import { BatchJobQueue } from '../../../util';
import { IUser } from "../../models";
import { IUserService } from '../user';
import { RecipientResolver } from './recipient-resolver';
import { MessageTemplateResolver } from './template-resolver';
import { BulkMessageReport, IBulkMessageService, IMessageContextFactory, IMessageTransport, IMessageTemplateResolver, IRecipientResolver } from './types';
import { getPreviewUser } from './preview-user';
import { createAppError, createValidationError } from '../..';
import { BulkMessageSendArgs } from '.';

const DEFAULT_SUBJECT = "Techies Welfare Notification";

export interface BulkMessageServiceArgs {
  contextFactory: IMessageContextFactory;
  templateResolver?: IMessageTemplateResolver;
  transport: IMessageTransport;
  recipientResolver?: IRecipientResolver;
  users: IUserService
}

export class BulkMessageService implements IBulkMessageService {
    recipientResolver: IRecipientResolver;
    contextFactory: IMessageContextFactory;
    templateResolver: IMessageTemplateResolver;
    transport: IMessageTransport;

    constructor(args: BulkMessageServiceArgs) {
        if (!args.recipientResolver && !args.users) {
            throw createAppError('Bulk message args must provide either recipientsResolver or users');
        }

        this.contextFactory = args.contextFactory;
        this.templateResolver = args.templateResolver || new MessageTemplateResolver();
        this.recipientResolver = args.recipientResolver || new RecipientResolver({ users: args.users });
        this.transport = args.transport;
    }

    async send({ recipients, message, subject }: BulkMessageSendArgs): Promise<BulkMessageReport> {
        // validate recipients
        const invalidGroups = recipients.filter(group => !this.recipientResolver.canResolve(group));
        if (invalidGroups.length) {
            throw createValidationError(`Invalid recipients: ${invalidGroups.map(g => `'${g}'`).join(', ')}`);
        }

        const report: BulkMessageReport = {
            errors: [],
            numFailed: 0,
            numRecipients: 0,
            recipients: []
        };

        const allRecipients = await this.getRecipients(recipients, report);
        await this.sendToRecipients(allRecipients, message, subject || DEFAULT_SUBJECT, report);

        return report;
    }

    async previewMessage(messageTemplate: string): Promise<string> {
        // create a dummy user and generate a preview message
        // based on that user
        const user = getPreviewUser();

        const message = await this.createMessageForUser(user, messageTemplate);
        return message;
    }

    private async getRecipients(recipientGroups: string[], report: BulkMessageReport): Promise<IUser[]> {
        const allRecipients: IUser[] = [];
        const recipientIds: Set<string> = new Set<string>();
        const tasks = recipientGroups.map(group => this.addRecipientsFromGroup(group, allRecipients, recipientIds, report));
        await Promise.all(tasks);
        return Array.from(allRecipients);
    }

    private async addRecipientsFromGroup(group: string, allRecipients: IUser[], recipientIds: Set<string>, report: BulkMessageReport) {
        try {
            const recipients = await this.recipientResolver.resolve(group);
            recipients.forEach(r => {
                if (!recipientIds.has(r._id)) {
                    allRecipients.push(r);
                    recipientIds.add(r._id);
                }
            });
        }
        catch (e) {
            report.errors.push({
                recipientGroup: group,
                user: null,
                name: null,
                message: e.message
            });

            report.numFailed += 1;
        }
    }

    private async sendToRecipients(recipients: IUser[], messageTemplate: string, subjectTemplate: string, report: BulkMessageReport): Promise<void> {
        var queue = new BatchJobQueue<IUser>(recipient => this.sendToRecipient(recipient, messageTemplate, subjectTemplate, report));

        recipients.forEach(recipient => queue.push(recipient));
        queue.signalEof();
        await queue.run();
    }

    private async sendToRecipient(recipient: IUser, template: string, subjectTemplate: string, report: BulkMessageReport): Promise<void> {
        try {
        const message = await this.createMessageForUser(recipient, template);
        const subject = await this.createMessageForUser(recipient, subjectTemplate);
        await this.transport.sendMessage(recipient, message, subject);
        report.numRecipients += 1;
        report.recipients.push({
            user: recipient._id,
            name: recipient.name
        });
        }
        catch (e) {
            report.errors.push({
                message: e.message,
                user: recipient._id,
                name: recipient.name
            });

            report.numFailed += 1;
        }
    }

    private async createMessageForUser(user: IUser, template: string): Promise<string> {
        const context = await this.contextFactory.createContextFromUser(user);
        const message = await this.templateResolver.resolve(context, template);
        return message;
    }

}