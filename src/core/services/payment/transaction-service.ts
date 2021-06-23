import { Collection, Db } from "mongodb";
import { ITransaction, IUser } from "../../models";
import { InitiatePaymentArgs, IPaymentHandlerProvider, ITransactionService, CreateTransactionArgs } from "./types";

const COLLECTION = "transactions";

export interface TransactionServiceArgs {
    paymentHandlers: IPaymentHandlerProvider;
}

export class TransactionService implements ITransactionService {
    db: Db;
    collection: Collection<ITransaction>;
    handlers: IPaymentHandlerProvider;

    constructor(db: Db) {
        this.collection = db.collection(COLLECTION);
    }

    async initiateUserPayment(user: IUser, args: InitiatePaymentArgs): Promise<ITransaction<any>> {
        const amount = Math.floor(args.amount);

        const provider = this.handlers.getDefault();

        const trxArgs: CreateTransactionArgs = {
            amount,
            fromUser: user._id,
            type: args.type,
            provider: provider.name(),
            status: 'pending',
            metadata: {}
        };

        try {
            const providerResult = await provider.requestPaymentFromUser(user, amount);
            trxArgs.providerTransactionId = providerResult.providerTransactionId;
            trxArgs.status = providerResult.status;
            trxArgs.metadata = providerResult.metadata;

            const result = await this.create(trxArgs);
            return result;
        }
        catch (e) {
            throw e;
        }
    }
    
    getUserBalance(userId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getContributionsByUser(userId: string): Promise<ITransaction<any>[]> {
        throw new Error("Method not implemented.");
    }
    checkTransactionStatus(transactionId: string): Promise<ITransaction<any>> {
        throw new Error("Method not implemented.");
    }

    private async create(args: CreateTransactionArgs): Promise<ITransaction> {
        const now = new Date();
        const tx: ITransaction = {
            _id: "generateId",
            ...args,
            amount: 0,
            status: args.status || 'pending',
            createdAt: now,
            updatedAt: now,
            metadata: args.metadata || {}
        };

        if (args.providerTransactionId) {
            tx.providerTransactionId = args.providerTransactionId;
        }

        try {
            const res = await this.collection.insertOne(tx);
            return res.ops[0];
        }
        catch (e) {
            throw e;
        }
    }
    
}

