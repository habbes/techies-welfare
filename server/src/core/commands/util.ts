import { CommandManager, ICommandContextFactory } from "../infra";
import { ICommandContext } from "./types";

export function createCommandManager(contextFactory: ICommandContextFactory<ICommandContext>) {
    return new CommandManager(contextFactory);
}
