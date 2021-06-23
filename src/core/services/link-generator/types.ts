import { IUser } from "../../models";

export interface ILinkGeneratorService {
    getUserPaymentLink(user: IUser, amount: number): Promise<string>;
}
