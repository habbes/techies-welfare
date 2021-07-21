import { ITransaction, IUser, IUserAccountSummary } from '../../models';
import { InitiatePaymentArgs } from '../payment';

export interface IUserService {
    create(args: CreateUserArgs): Promise<IUser>;
    getById(id: string): Promise<IUser>;
    getByPhone(phone: string): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction>;
    getTransactions(id: string): Promise<ITransaction[]>;
    getAccountSummary(id: string): Promise<IUserAccountSummary>;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    phone: string;
    team: string;
    joinedAt?: Date;
}