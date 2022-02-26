import { Role, Permission } from "../auth";

export interface HasId {
    _id: string;
}

export interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface HasCreatedBy {
    createdBy: IPrincipal;
};

/**
 * The type of principal or agent
 * who can interact with the system
 * e.g. the authenticated
 * user or the system itself for automated operations
 */
export type IPrincipalType = "user" | "system";

type UserPrincipal = { type: "user", _id: string };
type SystemPrincipal = { type: "system", _id: "system" };

/**
 * This represents an actor who executed
 * an operation on the system, e.g. the authenticated
 * user or the system itself for automated operations
 */
export type IPrincipal = UserPrincipal | SystemPrincipal;

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
