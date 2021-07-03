import { IUser, ITransaction, TransactionStatus, TransactionType } from "../../models";

export interface ITransactionService {
    initiateUserPayment(user: IUser, args: InitiatePaymentArgs): Promise<ITransaction>;
    getUserBalance(userId: string): Promise<number>;
    getContributionsByUser(userId: string): Promise<ITransaction[]>;
    checkTransactionStatus(transactionId: string): Promise<ITransaction>;
    handleProviderNotification<TPaymentNotification = Record<string, any>>(providerName: string, notification: TPaymentNotification): Promise<ITransaction>;
}

export interface IPaymentHandler<TProviderMetadata = Record<string, any>, TPaymentNotification = Record<string, any>> {
    name(): string;
    requestPaymentFromUser(user: IUser, amount: number): Promise<PaymentRequestResult<TProviderMetadata>>;
    handlePaymentNotification(notification: TPaymentNotification): Promise<ProviderTransactionInfo<TProviderMetadata>>;
    getTransaction(localTransaction: ITransaction): Promise<ProviderTransactionInfo<TProviderMetadata>>;
}

export interface IPaymentHandlerRegistry {
    register(provider: IPaymentHandler): void;
    setDefault(name: string): void;
    getProvider(): IPaymentHandlerProvider;
}

export interface IPaymentHandlerProvider {
    get<TProviderMetadata = Record<string, any>, TPaymentNotification = Record<string, any>>(name: string): IPaymentHandler<TProviderMetadata, TPaymentNotification>;
    getDefault(): IPaymentHandler;
}

export interface CreateTransactionArgs<TProviderMetadata = Record<string, any>> {
    fromUser: string;
    type: TransactionType;
    amount: number;
    provider: string;
    providerTransactionId?: string;
    status?: TransactionStatus;
    metadata: TProviderMetadata;
}

export interface InitiatePaymentArgs {
    amount: number;
    type: TransactionType;
}

export interface PaymentRequestResult<TProviderMetadata = Record<string, any>> {
    providerTransactionId: string;
    status: TransactionStatus;
    metadata: TProviderMetadata;
}

export interface ProviderTransactionInfo<TProviderMetadata = Record<string, any>> {
    status: TransactionStatus;
    amount: number;
    failureReason: string;
    providerTransactionId: string;
    metadata: TProviderMetadata;
}