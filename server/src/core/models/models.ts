export interface HasId {
    _id: string;
}

export interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export type Role = 'admin' | 'treasurer' | 'member';

export interface IUser extends HasId, HasTimestamps {
    name: string;
    team: string;
    phone: string;
    email: string;
    joinedAt: Date;
    roles: Role[];
}

export interface IAuthContext {
    user: IUser;
    scopes: string[];
}

export interface IUserAccountSummary {
    totalContribution: number;
    arrears: number;
}

export interface ITransaction<ProviderMetadata = any> extends HasId, HasTimestamps {
    amount: number;
    provider: string;
    providerTransactionId?: string;
    metadata: ProviderMetadata;
    status: TransactionStatus;
    type: TransactionType;
    fromUser: string;
    failureReason?: string;
}

export type TransactionStatus = 'pending' | 'failed' | 'success';
export type TransactionType = 'contribution';

export interface IAppSettings {
    monthlyReminderMessage: string;
    sendMonthlyReminders: boolean;
    monthlyContributionAmount: number;
}
