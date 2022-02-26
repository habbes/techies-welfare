import { rethrowIfAppError, createDbError } from "../../error";
import { getSystemPrincipal } from "../../auth";
import { IUserService } from "../user";
import { ISystemService, RunSetupArgs, RunSetupResult } from "./types";

export interface SystemServiceArgs {
    users: IUserService;
}

export class SystemService implements ISystemService {
    private users: IUserService;
    
    constructor(args: SystemServiceArgs) {
        this.users = args.users;
    }

    hasRunSetup(): Promise<boolean> {
        return this.users.hasAnyUsers();
    }

    async runSetup(args: RunSetupArgs): Promise<RunSetupResult> {
        try {
            // create admin user
            const admin = await this.users.create(args.admin, getSystemPrincipal());

            return {
                admin
            };
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }
}