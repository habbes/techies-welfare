import { makeCommand } from "../infra";
import { ICommandContext } from "./types";
import { requireScopes, validate } from "./middleware";
import {
    BulkMessageReport,
    BulkMessageSendArgs,
    CreateUserArgs,
    InitiatePaymentArgs,
    LoginArgs,
    ManualEntryTransactionData,
    RequestPassCodeArgs,
    RunSetupArgs,
    loginValidator,
    createUserValidator,
    requestPassCodeValidator,
    runSetupValidator,
    sendBulkMessageValidator,
    createManualTransactionValidator,
    getTransactionByProviderAndIdValidator,
    initiatePaymentValidator,
    previewMessageValidator,
    InitiatePaymentForUserArgs,
    initiateTransactionForUserValidator,
    BulkMessagePreviewArgs
} from "../services";
import { createUserPrincipal } from "..";
import { stringValidator } from "../../util";

export const hasSetupRun = makeCommand((_, context: ICommandContext) =>
    context.services.system.hasRunSetup());

export const runSetup = makeCommand((args: RunSetupArgs, context: ICommandContext) =>
    context.services.system.runSetup(args),
    [validate(runSetupValidator)]);

export const previewMessage = makeCommand((args: BulkMessagePreviewArgs, context: ICommandContext) => {
    return context.services.bulkMessages.previewMessage(args);
}, [requireScopes('Messages.Preview'), validate(previewMessageValidator)]);

export const notifyUsers = makeCommand<BulkMessageSendArgs, BulkMessageReport, ICommandContext>((args, context) => {
    return context.services.bulkMessages.send(args);
}, [requireScopes('Messages.Broadcast'), validate(sendBulkMessageValidator)]);

export const createUser = makeCommand((args: CreateUserArgs, context: ICommandContext) => {
    return context.services.users.create(args,
        { type: "user", _id: context.authContext.user._id });
}, [requireScopes('Users.Create'), validate(createUserValidator)]);

export const getUsers = makeCommand((_, context: ICommandContext) => {
    return context.services.users.getAll();
}, [requireScopes('Users.Read.All')]);

export const getUserById = makeCommand((id: string, context: ICommandContext) => {
    return context.services.users.getById(id);
}, [requireScopes('Users.Read.All'), validate(stringValidator)]);

export const login = makeCommand((args: LoginArgs, context: ICommandContext) => {
    return context.services.users.login(args);
}, [validate(loginValidator)]);

export const requestTemporaryPassCode = makeCommand((args: RequestPassCodeArgs, context: ICommandContext) => {
    return context.services.users.requestTemporaryPassCode(args);
}, [validate(requestPassCodeValidator)]);

export const logout = makeCommand((token: string, context: ICommandContext) =>
    context.services.users.logout(token),
    [requireScopes('Users.Logout.Self'), validate(stringValidator)]);

export const logoutAll = makeCommand((_, context: ICommandContext) =>
    context.services.users.logoutAll(context.authContext.user._id),
    [requireScopes('Users.Logout.Self')]);

export const getMe = makeCommand((_, context: ICommandContext) =>
    Promise.resolve(context.authContext.user),
    [requireScopes('Users.Read.Self')]);

export const getMyTransactions = makeCommand((_, context: ICommandContext) =>
    context.services.users.getTransactions(context.authContext.user._id),
    [requireScopes('Transactions.Read.Self')]);

export const getMyTransactionById = makeCommand((transactionId: string, context: ICommandContext) =>
    context.services.transactions.getByUserAndId(context.authContext.user._id, transactionId),
    [requireScopes('Transactions.Read.Self'), validate(stringValidator)]);

export const initiateTransaction = makeCommand((args: InitiatePaymentArgs, context: ICommandContext) =>
    context.services.users.initiatePayment(context.authContext.user._id, args),
    [requireScopes('Transactions.Initiate.Self'), validate(initiatePaymentValidator)]);

/**
 * This initiates a transaction request for the specified user. It's meant to handle
 * payment requests that were initiate from a payment link. For a convenient user
 * experience, I wanted the user to be able to open the link directly and pay without
 * having to log in first, that's why this command does not require authentication.
 * This means that someone else gets the payment link for a user (which is currently generated
 * deterministically from concatenating user details), they can initiate payment for a different user.
 * While they will not be able to carry out a transaction without the user's phone and MPESA PIN or debit/credit
 * card details, it's still not ideal. We could consider generating the links randomly and making
 * them ephemeral to be re-generated each time, and verified in the db (like short-lived tokens).
 * That would make things a bit more complex. I will probably revisit this later.
 */
export const initiateTransactionForUser = makeCommand((args: InitiatePaymentForUserArgs, context: ICommandContext) =>
    context.services.users.initiatePayment(args.userId, args),
    [validate(initiateTransactionForUserValidator)]);

export const getMyAccountSummary = makeCommand((_, context: ICommandContext) =>
    context.services.users.getAccountSummary(context.authContext.user._id),
    [requireScopes('Transactions.Read.Self', 'Users.Read.Self')]);

export const getUserTransactions = makeCommand((user: string, context: ICommandContext) =>
    context.services.users.getTransactions(user),
    [requireScopes('Transactions.Read.All', 'Users.Read.All'), validate(stringValidator)]);

export const getUserAccountSummary = makeCommand((user: string, context: ICommandContext) =>
    context.services.users.getAccountSummary(user),
    [requireScopes('Transactions.Read.All', 'Users.Read.All'), validate(stringValidator)]);

export const makeUserAdmin = makeCommand((user: string, context: ICommandContext) =>
    context.services.users.makeAdmin(user, createUserPrincipal(context.authContext.user._id)),
    [requireScopes('Users.Write.All'), validate(stringValidator)]);

export const getTransactions = makeCommand((_, context: ICommandContext) =>
    context.services.transactions.get({}),
    [requireScopes('Transactions.Read.All')]);

export const getTransactionById = makeCommand((id: string, context: ICommandContext) =>
    context.services.transactions.getById(id),
    [requireScopes('Transactions.Read.All'), validate(stringValidator)]);

export const createManualTransaction = makeCommand((args: ManualEntryTransactionData, context: ICommandContext) =>
    context.services.transactions.createManualTransaction(args, createUserPrincipal(context.authContext.user._id)),
    [requireScopes("Transactions.Create"), validate(createManualTransactionValidator)]);

// this doesn't require authorization since it's usually issued from the flutterwave
// post-payment page
export const getTransactionByProviderAndId = makeCommand((args: { provider: string, id: string }, context: ICommandContext) =>
    context.services.transactions.getByProviderId(args.provider, args.id),
    [validate(getTransactionByProviderAndIdValidator)]);