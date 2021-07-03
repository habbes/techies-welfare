export interface HasId {
    _id: string;
}

export interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends HasId, HasTimestamps {
    name: string;
    team: string;
    phone: string;
    email: string;
}

export interface ITransaction<ProviderMetadata = any> extends HasId, HasTimestamps {
    amount: number;
    provider: string;
    providerTransactionId?: string;
    metadata: ProviderMetadata;
    status: TransactionStatus;
    type: TransactionType;
    fromUser?: string;
}

export type TransactionStatus = 'pending' | 'failed' | 'success';
export type TransactionType = 'contribution';