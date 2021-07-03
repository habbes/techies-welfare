import { Db, Collection } from "mongodb";
import { generateId } from "../../../util";
import { IUser } from "../../models";
import { CreateUserArgs, IUserService } from "./types";

export const COLLECTION = "users";

export class UserService implements IUserService {
    private db: Db;
    private collection: Collection<IUser>;

    constructor(db: Db) {
        this.collection = this.db.collection(COLLECTION);
    }

    async create(args: CreateUserArgs): Promise<IUser> {
        const input = {
            ...args,
            _id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date()
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
}