import { ICommandContext, ICommandExecutor } from "../core";

export interface ICliContext {
    executor: ICommandExecutor<ICommandContext>;
}

export interface ICliCommand {
    /**
     * name of the cli command
     */
    name: string;
    /**
     * `true` if the command does not require authentication,
     * otherwise authentication will be required.
     */
    noAuth?: boolean;
    /**
     * runs the command
     */
    run: (context: ICliContext) => Promise<void>;
}
