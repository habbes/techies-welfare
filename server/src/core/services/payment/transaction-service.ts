import { Collection, Db } from "mongodb";
import { ITransaction, IUser, TransactionStatus } from "../../models";
import { generateId } from "../../../util";
import { InitiatePaymentArgs, IPaymentHandlerProvider, ITransactionService, CreateTransactionArgs } from "./types";

const COLLECTION = "transactions";

export interface TransactionServiceArgs {
    paymentHandlers: IPaymentHandlerProvider;
}

export class TransactionService implements ITransactionService {
    collection: Collection<ITransaction>;
    handlers: IPaymentHandlerProvider;

    constructor(db: Db, args: TransactionServiceArgs) {
        this.collection = db.collection(COLLECTION);
        this.handlers = args.paymentHandlers;
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

    async handleProviderNotification<TPaymentNotification = Record<string, any>>(providerName: string, notification: TPaymentNotification): Promise<ITransaction> {
        try {
            const now = new Date();
            const provider = this.handlers.get(providerName);
            const  result = await provider.handlePaymentNotification(notification);

            const updatedRes = await this.collection.findOneAndUpdate({
                providerTransactionId: result.providerTransactionId,
                provider: provider.name()
            }, {
                $set: {
                    status: result.status,
                    failureReason: result.failureReason,
                    metadata: result.metadata,
                    updatedAt: now,
                    amount: result.amount
                }
            }, {
                returnDocument: "after"
            });

            if (!updatedRes.value) {
                throw new Error("Unknown transaction");
            }

            return updatedRes.value;
        }
        catch (e) {
            throw e;
        }
    }
    
    async getUserContributionsTotal(userId: string): Promise<number> {
        try {
            const results = await this.collection.aggregate<{ total : number }>([
                {
                    $match: {
                        $or: [
                            // be conservative when dealing with pending transactions:
                            // if transaction is from the user, deduct it from balance unless it's failed
                            { from: userId, status: 'success' }
                        ]
                    }
                },
                {
                    $project: { from: 1, to: 1, amount: 1, expectedAmount: 1, status: 1 }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]).toArray();

            if (!results.length) return 0;

            return results[0].total;
        }
        catch (e) {
            throw e;
        }
    }

    async getAllByUser(userId: string): Promise<ITransaction<any>[]> {
        try {
            const result = await this.collection.find({ $or: [{ from: userId }, { to: userId }] }).sort({ createdAt: -1 }).toArray();
            return result;
        }
        catch (e) {
            throw e;
        }
    }

    async checkTransactionStatus(transactionId: string): Promise<ITransaction<any>> {
        try {
            const trx = await this.collection.findOne({ _id: transactionId });
            if (!trx) throw new Error("Transaction not found");

            if (isFinalStatus(trx.status)) {
                return trx;
            }

            const providerResult = await this.handlers.get(trx.provider).getTransaction(trx);
            const updatedRes = await this.collection.findOneAndUpdate(
                { _id: trx._id }, 
                {
                $set: {
                    status: providerResult.status,
                    failureReason: providerResult.failureReason,
                    metadata: providerResult.metadata,
                    updatedAt: new Date(),
                    amount: providerResult.amount
                }
            }, { returnOriginal: false });
            
            if (!updatedRes.value) throw new Error("Transaction not found");
            return updatedRes.value;
        }
        catch (e) {
            throw e;
        }
    }

    private async create(args: CreateTransactionArgs): Promise<ITransaction> {
        const now = new Date();
        const tx: ITransaction = {
            _id: generateId(),
            ...args,
            amount: args.amount,
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


function isFinalStatus(status: TransactionStatus) {
    return status === 'failed' || status === 'success';
}
