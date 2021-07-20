import { Collection, Db } from "mongodb";
import { ITransaction, IUser } from "../../models";
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

