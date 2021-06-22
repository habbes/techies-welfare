import { IUser } from '../../models';

export interface IUserService {
    create(args: CreateUserArgs): Promise<IUser>;
    getById(id: string): Promise<IUser>;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    phone: string;
    team: string;
}