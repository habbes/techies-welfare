import { ITransaction, IUser } from '../../models';
import { InitiatePaymentArgs } from '../payment';

export interface IUserService {
    create(args: CreateUserArgs): Promise<IUser>;
    getById(id: string): Promise<IUser>;
    getByPhone(phone: string): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction>;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    phone: string;
    team: string;
}