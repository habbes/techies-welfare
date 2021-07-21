import { Db, Collection } from "mongodb";
import { generateId } from "../../../util";
import { ITransaction, IUser, IUserAccountSummary } from "../../models";
import { InitiatePaymentArgs, ITransactionService } from "../payment";
import { IAppSettingsService } from "../settings/types";
import { CreateUserArgs, IUserService } from "./types";

export const COLLECTION = "users";

export interface UserServiceArgs {
    transactions: ITransactionService;
    settings: IAppSettingsService;
}

export class UserService implements IUserService {
    private collection: Collection<IUser>;
    private transactions: ITransactionService;
    private settings: IAppSettingsService;

    constructor(db: Db, args: UserServiceArgs) {
        this.collection = db.collection(COLLECTION);
        this.transactions = args.transactions;
        this.settings = args.settings;
    }

    async create(args: CreateUserArgs): Promise<IUser> {
        const now = new Date();
        const input = {
            ...args,
            _id: generateId(),
            createdAt: now,
            updatedAt: now,
            joinedAt: args.joinedAt || now
        };

        try {
            const result = await this.collection.insertOne(input);
            return result.ops[0];
        }
        catch (err) {
            // TODO: custom error
            throw err;
        }
    }

    async getById(id: string): Promise<IUser> {
        try {
            const user = await this.collection.findOne({ _id: id });
            if (!user) {
                throw new Error("not found");
            }

            return user;
        }
        catch (e) {
            throw e;
        }
    }

    async getByPhone(phone: string): Promise<IUser> {
        try {
            const user = await this.collection.findOne({ phone });
            if (!user) {
                throw new Error("not found");
            }

            return user;
        }
        catch (e) {
            throw e;
        }
    }

    async getAll(): Promise<IUser[]> {
        try {
            const users = await this.collection.find({}).toArray();
            return users;
        }
        catch (e) {
            throw e;
        }
    }

    async initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction> {
        try {
            const user = await this.getById(id);
            const trx = await this.transactions.initiateUserPayment(user, args);
            return trx;
        }
        catch (e) {
            throw e;
        }
    }

    getTransactions(id: string): Promise<ITransaction[]> {
        return this.transactions.getAllByUser(id);
    }

    async getAccountSummary(id: string): Promise<IUserAccountSummary> {
        const user = await this.getById(id);
        const totalContribution = await this.transactions.getUserContributionsTotal(id);
        const settings = await this.settings.getAppSettings();

        const arrears = computeArrears(user, totalContribution, settings.monthlyContributionAmount);
        
        return {
            totalContribution,
            arrears
        };
    }
}

function computeArrears(user: IUser, totalContribution: number, monthlyContribution: number) {
    // arrears computation
    const now = new Date();
    const yearDiff = now.getFullYear() - user.joinedAt.getFullYear();
    const monthDiff = (yearDiff * 12) + (now.getMonth() - user.joinedAt.getMonth());
    const expectedContribution = monthDiff * monthlyContribution;
    const arrears = expectedContribution - totalContribution;

    return arrears;
}
