import { Role, Permission } from "../auth";

export interface HasId {
    _id: string;
}

export interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface HasCreatedBy {
    createdBy: CreatedBy;
};

export type CreatedByType = "user" | "system";
export type CreatedBy = { type: CreatedByType, _id?: string };

export interface IUser extends HasId, HasTimestamps, HasCreatedBy {
    name: string;
    team: string;
    phone: string;
    email: string;
    idNumber?: string;
    status: UserStatus;
    nextOfKin?: IUserNextOfKin,
    memberSince: Date;
    roles: Role[];
}

export type UserStatus = 'active' | 'disabled';

export interface IUserNextOfKin {
    name: string;
    phone: string;
    email: string;
    relationship: string;
}

export interface IAuthToken extends HasId, HasTimestamps {
    expiresAt: Date;
    user: string;
    scopes: Permission[];
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
