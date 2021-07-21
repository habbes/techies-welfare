import { ILinkGeneratorService } from '../link-generator';
import { IUser } from '../../models';
import { IMessageContextFactory, MessageTemplateContext } from './types';
import { IUserService } from '../user';
import { getPreviewUser, getPreviewAccountSummary } from './preview-user';

const DEFAULT_CONTRIBUTION = 1000;

export interface MessageContextFactoryArgs {
  linkGenerator: ILinkGeneratorService;
  baseUrl: string;
  users: IUserService;
}

export class MessageContextFactory implements IMessageContextFactory {
  linkGenerator: ILinkGeneratorService;
  baseUrl: string;

  constructor(private args: MessageContextFactoryArgs) {}

  async createContextFromUser(user: IUser): Promise<MessageTemplateContext> {
    const { totalContribution, arrears } = user._id === getPreviewUser()._id ? // this is a hack to handle preview messages
      getPreviewAccountSummary() : await this.args.users.getAccountSummary(user._id);

    const paymentAmount = Math.max(arrears, DEFAULT_CONTRIBUTION);

    return {
      firstName: user.name.split(" ")[0],
      baseUrl: this.args.baseUrl,
      paymentLink: await this.args.linkGenerator.getUserPaymentLink(user, paymentAmount),
      totalContribution: totalContribution,
      arrears: arrears
    };
  }
}
