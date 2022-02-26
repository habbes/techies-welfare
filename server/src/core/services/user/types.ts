import { Permission } from '../../auth';
import { ITransaction, IUser, IAuthToken, IUserAccountSummary, IUserNextOfKin, UserStatus, IPrincipal } from '../../models';
import { InitiatePaymentArgs } from '../payment';

export interface IUserService {
    create(args: CreateUserArgs, createdBy: IPrincipal): Promise<IUser>;
    getById(id: string): Promise<IUser>;
    getByPhone(phone: string): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    login(args: LoginArgs): Promise<LoginResult>;
    requestTemporaryPassCode(args: RequestPassCodeArgs): Promise<void>;
    getByToken(tokenId: string): Promise<GetByTokenResult>;
    logout(token: string): Promise<void>
    logoutAll(user: string): Promise<void>
    initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction>;
    getTransactions(id: string): Promise<ITransaction[]>;
    getAccountSummary(id: string): Promise<IUserAccountSummary>;
    /**
     * Checks whether there are any users in the database.
     * This is only used to verify whether initial system
     * has ran
     */
    hasAnyUsers(): Promise<boolean>;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    phone: string;
    team: string;
    idNumber: string;
    status: UserStatus;
    nextOfKin: IUserNextOfKin;
    password?: string;
    memberSince: Date;
}

export interface LoginArgs {
    /**
     * email or phone
     */
    login: string;
    /**
     * password
     */
    password?: string;
    /**
     * one-time-passcode
     */
    otp?: string;
}

export interface RequestPassCodeArgs {
    /**
     * email or phone
     */
    login: string;
}

export interface LoginResult {
    token: IAuthToken;
    user: IUser;
};

export interface GetByTokenResult extends IUser {
    scopes: Permission[];
}