import { MessageTemplateContext, IMessageTemplateResolver } from './types';

const regexForPlaceholder = (placeholder: string) => new RegExp(`{${placeholder}}`, 'gi');

export class MessageTemplateResolver implements IMessageTemplateResolver {
    resolve(context: MessageTemplateContext, messageTemplate: string): Promise<string> {
        const vars = Object.keys(context);
        const message = vars.reduce((messageSoFar, placeholder) =>
        messageSoFar.replace(regexForPlaceholder(placeholder), context[placeholder]),
        messageTemplate)
        
        return Promise.resolve(message);
    }
}
