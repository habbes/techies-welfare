import * as querystring from "querystring";
import { IUser } from "../../models";
import { ILinkGeneratorService } from "./types";

export interface LinkGeneratorArgs {
    baseUrl: string;
}

export class LinkGeneratorService implements ILinkGeneratorService {
    constructor(private args: LinkGeneratorArgs) {}

    getUserPaymentLink(user: IUser, amount: number): Promise<string> {
        const query = { u: user._id, n: user.name, a: amount };
        const encodedQuery = querystring.encode(query);
        const link = `${this.args.baseUrl}/pay?${encodedQuery}`

        return Promise.resolve(link);
    }
}
