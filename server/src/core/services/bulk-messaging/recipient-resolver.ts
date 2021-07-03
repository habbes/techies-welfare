import { IUser } from "../../models";
import { IUserService } from "../user";
import { IRecipientResolver } from "./types";

const ALL_GROUP = "all";

export interface RecipientResolverArgs {
    users: IUserService;
}

export class RecipientResolver implements IRecipientResolver {
    private innerResolver: CombinedRecipientResolver;

    constructor(args: RecipientResolverArgs) {
        this.innerResolver = new CombinedRecipientResolver(
            new AllGroupRecipientResolver(args.users),
            new PhoneRecipientResolver(args.users)
        );
    }

    canResolve(recipient: string): boolean {
        return this.innerResolver.canResolve(recipient);
    }

    resolve(recipient: string): Promise<IUser[]> {
        return this.innerResolver.resolve(recipient);
    }
}

export class CombinedRecipientResolver implements IRecipientResolver {
    private resolvers: IRecipientResolver[];
  
    constructor(...resolvers: IRecipientResolver[]) {
      this.resolvers = resolvers;
    }
  
    canResolve(recipient: string): boolean {
      return this.resolvers.some(resolver => resolver.canResolve(recipient));
    }
    
    resolve(recipient: string): Promise<IUser[]> {
      const resolver = this.resolvers.find(candidate => candidate.canResolve(recipient));
      if (!resolver) throw new Error(`Recipient resolver not found for recipient ${resolver}`);
  
      return resolver.resolve(recipient);
    }
  }
  

export class AllGroupRecipientResolver implements IRecipientResolver {
    constructor(private users: IUserService) {}

    canResolve(recipient: string): boolean {
        return recipient === ALL_GROUP;
    }

    resolve(recipient: string): Promise<IUser[]> {
        return this.users.getAll();
    }
}

export class PhoneRecipientResolver implements IRecipientResolver {
    constructor(private users: IUserService) {}
    
    canResolve(recipient: string): boolean {
        return /[\+0-9]+/.test(recipient);
    }
  
    async resolve(recipient: string): Promise<IUser[]> {
        const user = await this.users.getByPhone(recipient);
        return [user];
    }
}
