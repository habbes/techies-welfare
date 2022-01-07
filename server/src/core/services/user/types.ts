import { ITransaction, IUser, IAuthToken, IUserAccountSummary } from '../../models';
import { InitiatePaymentArgs } from '../payment';

export interface IUserService {
    create(args: CreateUserArgs): Promise<IUser>;
    getById(id: string): Promise<IUser>;
    getByPhone(phone: string): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    login(args: LoginArgs): Promise<LoginResult>;
    getByToken(tokenId: string): Promise<IUser>;
    logout(token: string): Promise<void>
    logoutAll(user: string): Promise<void>
    initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction>;
    getTransactions(id: string): Promise<ITransaction[]>;
    getAccountSummary(id: string): Promise<IUserAccountSummary>;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    phone: string;
    team: string;
    password: string; // TODO: remove password from args
    joinedAt?: Date;
}

export interface LoginArgs {
    /**
     * email or phone
     */
    login: string;
    password: string;
}

export interface LoginResult {
    token: IAuthToken;
    user: IUser;
};