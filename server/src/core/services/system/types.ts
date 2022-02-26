import { IUser } from "../../models";
import { CreateUserArgs } from "../user";

export interface RunSetupArgs {
    /**
     * the initial admin of the system
     */
    admin: CreateUserArgs;
}

export interface RunSetupResult {
    admin: IUser;
}

export interface ISystemService {
    /**
     * Checks whether the setup has already run
     */
    hasRunSetup(): Promise<boolean>;
    /**
     * Runs the system setup
     */
    runSetup(args: RunSetupArgs): Promise<RunSetupResult>;
}