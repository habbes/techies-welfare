import { Db, Collection } from "mongodb";
import { LoginArgs, LoginResult } from "./types";
import {
    createDbError,
    rethrowIfAppError,
    createResourceNotFoundError,
    createInvalidTokenError,
    createInvalidLoginError,
    isMongoDuplicateKeyError,
    createUniquenessFailedError,
    createPermissionError
} from "../../error";
import { generateId, generateToken, hashPassword, verifyPassword } from "../../../util";
import { getDefaultScopesForRole, Role } from "../../auth";
import { CreatedBy, IAuthToken, ITransaction, IUser, IUserAccountSummary } from "../../models";
import { InitiatePaymentArgs, ITransactionService } from "../payment";
import { IAppSettingsService } from "../settings";
import { CreateUserArgs, IUserService, GetByTokenResult } from "./types";

export const COLLECTION = "users";
const TOKEN_COLLECTION = "auth_tokens";
const TOKEN_VALIDITY_MILLIS = 2 * 24 * 3600 * 1000; // 2 days

type SafeUserProjection = Record<keyof IUser, number>;

/**
 * used to ensure sensitive details are not leaked
 * from the database
 */
const SAFE_USER_PROJECTION: SafeUserProjection = {
    _id: 1,
    email: 1,
    name: 1,
    phone: 1,
    team: 1,
    idNumber: 1,
    nextOfKin: 1,
    roles: 1,
    createdAt: 1,
    updatedAt: 1,
    memberSince: 1,
    status: 1,
    createdBy: 1
};

interface IStoredUser extends IUser {
    password: string;
    hasPassword: boolean;
}

export interface UserServiceArgs {
    transactions: ITransactionService;
    settings: IAppSettingsService;
}

export class UserService implements IUserService {
    private collection: Collection<IStoredUser>;
    private tokenCollection: Collection<IAuthToken>;
    private transactions: ITransactionService;
    private settings: IAppSettingsService;

    constructor(db: Db, args: UserServiceArgs) {
        this.collection = db.collection(COLLECTION);
        this.tokenCollection = db.collection(TOKEN_COLLECTION);
        this.transactions = args.transactions;
        this.settings = args.settings;
    }

    async create(args: CreateUserArgs, createdBy: CreatedBy): Promise<IUser> {
        const now = new Date();
        const hasPassword = !!args.password;

        if (hasPassword && createdBy.type === "user") {
            throw createPermissionError("Cannot set password for another user");
        }

        const password = hasPassword ? await hashPassword(args.password) : "";
        const input: IStoredUser = {
            ...args,
            _id: generateId(),
            createdAt: now,
            updatedAt: now,
            memberSince: args.memberSince || now,
            roles: ['member'] as Role[],
            hasPassword,
            password,
            createdBy
        };

        try {
            const result = await this.collection.insertOne(input);
            return getSafeUser(result.ops[0]);
        }
        catch (err) {
            if (isMongoDuplicateKeyError(err, 'email')) {
                throw createUniquenessFailedError('Email already registered.');
            }

            if (isMongoDuplicateKeyError(err, 'phone')) {
                throw createUniquenessFailedError('Phone number already registered.');
            }

            rethrowIfAppError(err);
            throw createDbError(err);
        }
    }

    async getById(id: string): Promise<IUser> {
        try {
            const user = await this.collection.findOne({ _id: id }, { projection: SAFE_USER_PROJECTION });
            if (!user) {
                throw createResourceNotFoundError();
            }

            return user;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }

    async getByPhone(phone: string): Promise<IUser> {
        try {
            const user = await this.collection.findOne({ phone }, { projection: SAFE_USER_PROJECTION });
            if (!user) {
                throw createResourceNotFoundError();
            }

            return user;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }

    async getAll(): Promise<IUser[]> {
        try {
            const users = await this.collection.find({}, { projection: SAFE_USER_PROJECTION }).toArray();
            return users;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }

    async login(args: LoginArgs): Promise<LoginResult> {
        try {
            const user = await this.collection.findOne(
                { $or: [{ phone: args.login }, { email: args.login }] });
            
            if (!user) throw createInvalidLoginError();

            // TODO: if password not provided, verify TAN code
            const passwordCorrect = await verifyPassword(user.password, args.password);
            if (!passwordCorrect) throw createInvalidLoginError();

            const token = await this.createAuthToken(user);

            return {
                token,
                user: getSafeUser(user)
            };
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

    async getByToken(tokenId: string): Promise<GetByTokenResult> {
        try {
            const token = await this.tokenCollection.findOne({ _id: tokenId, expiresAt:  { $gt: new Date() }});
            if (!token) throw createInvalidTokenError();

            const user = await this.collection.findOne({ _id: token.user }, { projection: SAFE_USER_PROJECTION });
            if (!user) throw createInvalidTokenError();

            return { ...user, scopes: token.scopes };
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }

    async logout(token: string): Promise<void> {
        try {
            await this.tokenCollection.deleteOne({ _id: token });
        }
        catch (e) {
            throw createDbError(e.message)
        }
    }

    async logoutAll(user: string): Promise<void> {
        try {
            await this.tokenCollection.deleteMany({ user })
        }
        catch (e) {
            throw createDbError(e.message);
        }
    }

    async initiatePayment(id: string, args: InitiatePaymentArgs): Promise<ITransaction> {
        try {
            const user = await this.getById(id);
            const trx = await this.transactions.initiateUserPayment(user, args);
            return trx;
        }
        catch (e) {
           rethrowIfAppError(e);
           throw createDbError(e.message);
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

    private async createAuthToken(user: IUser): Promise<IAuthToken> {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + TOKEN_VALIDITY_MILLIS);
        const scopes = getDefaultScopesForRole(user.roles);
        const token = {
            _id: generateToken(),
            createdAt: now,
            updatedAt: now,
            expiresAt,
            user: user._id,
            scopes
        };

        try {
            const res = await this.tokenCollection.insertOne(token);
            return res.ops[0];
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e.message);
        }
    }
}

function computeArrears(user: IUser, totalContribution: number, monthlyContribution: number) {
    // arrears computation
    const now = new Date();
    const joinedAt = new Date(user.memberSince);
    console.log('Arrears', joinedAt);
    const yearDiff = now.getFullYear() - joinedAt.getFullYear();
    const monthDiff = (yearDiff * 12) + (now.getMonth() - joinedAt.getMonth());
    const expectedContribution = monthDiff * monthlyContribution;
    const arrears = expectedContribution - totalContribution;

    return arrears;
}

/**
 * removes fields that should
 * not be shared from the user
 * @param user 
 */
 function getSafeUser(user: IStoredUser): IUser {
    const userDict: any = user;
    return Object.keys(SAFE_USER_PROJECTION)
      .reduce<any>((safeUser, field) => {
        if (field in user) {
          safeUser[field] = userDict[field];
        }
  
        return safeUser;
      }, {});
  }