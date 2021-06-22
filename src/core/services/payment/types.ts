import { IUser, ITransaction, TransactionStatus, TransactionType } from "../../models";

export interface ITransactionService {
    initiateUserPayment(user: IUser, args: InitiatePaymentArgs): Promise<ITransaction>;
    getUserBalance(userId: string): Promise<number>;
    getContributionsByUser(userId: string): Promise<ITransaction[]>;
    checkTransactionStatus(transactionId: string): Promise<ITransaction>;
}

export interface IPaymentProvider<TProviderMetadata = Record<string, any>, TPaymentNotification = Record<string, any>> {
    name(): string;
    requestPaymentFromUser(user: IUser, amount: number): Promise<PaymentRequestResult>;
    handlePaymentNotification(notification: TPaymentNotification): Promise<ProviderTransactionInfo>;
    getTransaction(localTransaction: ITransaction): Promise<ProviderTransactionInfo>;
}

export interface IPaymentProviderRegistry {
    register(provider: IPaymentProvider): void;
    get<TProviderMetadata = Record<string, any>, TPaymentNotification = Record<string, any>>(name: string): IPaymentProvider<TProviderMetadata, TPaymentNotification>;
    getDefault(): IPaymentProvider;
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