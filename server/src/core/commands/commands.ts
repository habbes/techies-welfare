import { makeCommand } from "../infra";
import { ICommandContext } from "./types";
import { requireScopes } from "./middleware";
import { BulkMessageReport, BulkMessageSendArgs, CreateUserArgs, InitiatePaymentArgs, LoginArgs } from "../services";

export const previewMessage = makeCommand<string, string, ICommandContext>((message, context) => {
    return context.services.bulkMessages.previewMessage(message);
}, [requireScopes('Messages.Preview')]);

export const notifyUsers = makeCommand<BulkMessageSendArgs, BulkMessageReport, ICommandContext>((args, context) => {
    return context.services.bulkMessages.send(args);
}, [requireScopes('Messages.Broadcast')]);

export const createUser = makeCommand((args: CreateUserArgs, context: ICommandContext) => {
    return context.services.users.create(args,
        { type: "user", _id: context.authContext.user._id });
}, [requireScopes('Users.Create')]);

export const getUsers = makeCommand((_, context: ICommandContext) => {
    return context.services.users.getAll();
}, [requireScopes('Users.Read.All')]);

export const login = makeCommand((args: LoginArgs, context: ICommandContext) => {
    return context.services.users.login(args);
});

export const logout = makeCommand((token: string, context: ICommandContext) =>
    context.services.users.logout(token),
    [requireScopes('Users.Logout.Self')]);

export const logoutAll = makeCommand((_, context: ICommandContext) =>
    context.services.users.logoutAll(context.authContext.user._id),
    [requireScopes('Users.Logout.Self')]);

export const getMe = makeCommand((_, context: ICommandContext) =>
    Promise.resolve(context.authContext.user),
    [requireScopes('Users.Read.Self')]);

export const getMyTransactions = makeCommand((_, context: ICommandContext) =>
    context.services.users.getTransactions(context.authContext.user._id),
    [requireScopes('Transactions.Read.Self')]);

export const initiateTransaction = makeCommand((args: InitiatePaymentArgs, context: ICommandContext) =>
    context.services.users.initiatePayment(context.authContext.user._id, args),
    [requireScopes('Transactions.Initiate.Self')]);

export const getMyAccountSummary = makeCommand((_, context: ICommandContext) =>
    context.services.users.getAccountSummary(context.authContext.user._id),
    [requireScopes('Transactions.Read.Self', 'Users.Read.Self')]);

export const getUserTransactions = makeCommand((user: string, context: ICommandContext) =>
    context.services.users.getTransactions(user),
    [requireScopes('Transactions.Read.All')]);

export const getUserAccountSummary = makeCommand((user: string, context: ICommandContext) =>
    context.services.users.getAccountSummary(user),
    [requireScopes('Transactions.Read.All', 'Users.Read.All')]);

export const getTransactions = makeCommand((_, context: ICommandContext) =>
    context.services.transactions.getAll(),
    [requireScopes('Transactions.Read.All')]);
