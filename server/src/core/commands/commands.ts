import { makeCommand } from "../infra";
import { ICommandContext } from "./types";
import { requireScopes } from "./middleware";
import { BulkMessageReport, BulkMessageSendArgs, CreateUserArgs } from "../services";

export const previewMessage = makeCommand<string, string, ICommandContext>((message, context) => {
    return context.services.bulkMessages.previewMessage(message);
}, [requireScopes('Messages.Preview')]);

export const notifyUsers = makeCommand<BulkMessageSendArgs, BulkMessageReport, ICommandContext>((args, context) => {
    return context.services.bulkMessages.send(args);
}, [requireScopes('Messages.Broadcast')]);

export const createUser = makeCommand((args: CreateUserArgs, context: ICommandContext) => {
    return context.services.users.create(args)
}, [requireScopes('Users.Create')]);

export const getUsers = makeCommand((_, context: ICommandContext) => {
    return context.services.users.getAll();
}, [requireScopes('Users.Read.All')]);
