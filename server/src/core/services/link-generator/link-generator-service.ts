import * as querystring from "querystring";
import { IUser } from "../../models";
import { ILinkGeneratorService } from "./types";

export interface LinkGeneratorArgs {
    baseUrl: string;
}

export class LinkGeneratorService implements ILinkGeneratorService {
    constructor(private args: LinkGeneratorArgs) {}

    getUserPaymentLink(user: IUser, amount: number): Promise<string> {
        const query = { n: user.name, e: user.email, p: user.phone, a: amount };
        const encodedQuery = querystring.encode(query);
        const link = `${this.args.baseUrl}?pay=1&${encodedQuery}`

        return Promise.resolve(link);
    }
}
