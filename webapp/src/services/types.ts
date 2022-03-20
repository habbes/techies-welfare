export interface HasId {
    _id: string;
}

export interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser {
    _id: string;
    name: string;
    roles: string[];
}

export type TransactionStatus = 'pending' | 'failed' | 'success';
export type TransactionType = 'contribution';

export interface ITransaction extends HasId, HasTimestamps {
    amount: number;
    provider: string;
    providerTransactionId?: string;
    metadata: any;
    status: TransactionStatus;
    type: TransactionType;
    fromUser: string;
    failureReason?: string;
}