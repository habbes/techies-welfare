import { ILinkGeneratorService } from '../link-generator';
import { IUser } from '../../models';
import { IMessageContextFactory, MessageTemplateContext } from './types';

const DEFAULT_CONTRIBUTION = 1000;

export interface MessageContextFactoryArgs {
  linkGenerator: ILinkGeneratorService;
  baseUrl: string;
}

export class MessageContextFactory implements IMessageContextFactory {
  linkGenerator: ILinkGeneratorService;
  baseUrl: string;

  constructor(private args: MessageContextFactoryArgs) {}

  async createContextFromUser(user: IUser): Promise<MessageTemplateContext> {
    return {
      firstName: user.name.split(" ")[0],
      baseUrl: this.args.baseUrl,
      paymentLink: await this.args.linkGenerator.getUserPaymentLink(user, DEFAULT_CONTRIBUTION)
    };
  }
}
