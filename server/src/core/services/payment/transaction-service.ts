import { Collection, Db } from "mongodb";
import { IPrincipal, ITransaction, ITransactionWithUserData, IUser, TransactionStatus } from "../../models";
import { generateId } from "../../../util";
import { InitiatePaymentArgs, IPaymentHandlerProvider, ITransactionService, CreateTransactionArgs, ITransactionFilter } from "./types";
import { ManualEntryTransactionData, MANUAL_ENTRY_PAYMENT_PROVIDER_NAME } from "./manual-entry-provider";
import { createResourceNotFoundError, rethrowIfAppError, createDbError, isMongoDuplicateKeyError, createUniquenessFailedError } from "../../error";
import { createUserPrincipal, getSystemPrincipal } from "../../auth";
import { COLLECTION as USERS_COLLECTION } from "../user";

const COLLECTION = "transactions";

export interface TransactionServiceArgs {
    paymentHandlers: IPaymentHandlerProvider;
}

export class TransactionService implements ITransactionService {
    collection: Collection<ITransaction>;
    handlers: IPaymentHandlerProvider;
    private indexesCreated = false;

    constructor(db: Db, args: TransactionServiceArgs) {
        this.collection = db.collection(COLLECTION);
        this.handlers = args.paymentHandlers;
    }

    async createIndexes(): Promise<void> {
        if (this.indexesCreated) return;

        try {
            await this.collection.createIndex({
                providerTransactionId: 1, provider: 1
            }, {
                unique: true,
                partialFilterExpression: {
                    providerTransactionId: { $exists: true }
                }
            });

            await this.collection.createIndex({ fromUser: 1 });
            await this.collection.createIndex({ createdAt: -1 });

            this.indexesCreated = true;
        }
        catch (e) {
            throw createDbError(e);
        }
    }

    async initiateUserPayment(user: IUser, args: InitiatePaymentArgs): Promise<ITransaction<any>> {
        const amount = Math.floor(args.amount);
        console.log('amount', args.amount);

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

            const result = await this.create(trxArgs, createUserPrincipal(user._id));
            return result;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

    async createManualTransaction(args: ManualEntryTransactionData, recordedBy: IPrincipal): Promise<ITransaction> {
        const provider = this.handlers.get(MANUAL_ENTRY_PAYMENT_PROVIDER_NAME);

        const trxArgs: CreateTransactionArgs = {
            amount: args.amount,
            fromUser: args.fromUser,
            type: 'contribution',
            provider: provider.name(),
            status: 'pending',
            metadata: {}
        };

        try {
            const providerResult = await provider.handlePaymentNotification(args);
            trxArgs.providerTransactionId = providerResult.providerTransactionId;
            trxArgs.status = providerResult.status;
            trxArgs.metadata = providerResult.metadata;
            trxArgs.metadata.recordedBy = recordedBy;

            const result = await this.create(trxArgs, recordedBy);
            return result;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

    async handleProviderNotification<TPaymentNotification = Record<string, any>>(providerName: string, notification: TPaymentNotification): Promise<ITransaction> {
        try {
            const now = new Date();
            const provider = this.handlers.get(providerName);
            const result = await provider.handlePaymentNotification(notification);

            const updatedRes = await this.collection.findOneAndUpdate({
                providerTransactionId: result.providerTransactionId,
                provider: provider.name()
            }, {
                $set: {
                    status: result.status,
                    failureReason: result.failureReason,
                    metadata: result.metadata,
                    updatedAt: now,
                    updatedBy: getSystemPrincipal(),
                    amount: result.amount
                }
            }, {
                returnDocument: "after"
            });

            if (!updatedRes.value) {
                throw createResourceNotFoundError("Unknown transaction");
            }

            return updatedRes.value;
        }
        catch (e) {
            rethrowIfAppError(e);
            createDbError(e);
        }
    }

    async getUserContributionsTotal(userId: string): Promise<number> {
        try {
            const results = await this.collection.aggregate<{ total: number }>([
                {
                    $match: { fromUser: userId, status: 'success' }
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
            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

    getAllByUser(userId: string): Promise<ITransactionWithUserData<any>[]> {
        return this.get({ fromUser: userId });
    }

    async get(rawFilter: ITransactionFilter): Promise<ITransactionWithUserData[]> {
        const filter: Partial<ITransaction> = {};

        if (rawFilter.fromUser) {
            filter.fromUser = rawFilter.fromUser;
        }

        if (rawFilter.id) {
            filter._id = rawFilter.id;
        }

        if (rawFilter.provider) {
            filter.provider = rawFilter.provider;
        }

        if (rawFilter.providerTransactionId) {
            filter.providerTransactionId = rawFilter.providerTransactionId;
        }

        const pipeline:  object[] = [
            {
                $match: filter
            },
            {
                // this will add an array `fromUserDataRaw`
                // containing all the data of the paying user
                $lookup: {
                    from: USERS_COLLECTION,
                    localField: 'fromUser',
                    foreignField: '_id',
                    as: 'fromUserDataRaw'
                }
            },
            {
                // we extract only the fields we care about from
                // the first (and only) item in the `fromUserDataRaw` array
                // into the `fromUserData` object
                $addFields: {
                    // `$fromUserDataRaw._id` will return the ids of all objects in the array
                    // so we just take the first id, same for the name
                    'fromUserData._id': { $arrayElemAt: ['$fromUserDataRaw._id', 0] },
                    'fromUserData.name': { $arrayElemAt: ['$fromUserDataRaw.name', 0] }
                }
            },
            {
                $project: { fromUserDataRaw: 0 }
            }
        ];

        if (filter._id || filter.providerTransactionId) {
            // if ID was specified, the we only expect a single result
            // and don't need to sort
            pipeline.push({ $limit: 1 });
        }
        else {
            pipeline.push({ $sort: { createdAt: -1 } });
        }

        try {
            const result = await this.collection
            .aggregate<ITransactionWithUserData>(pipeline)
            .toArray();

            return result;
        }
        catch (e) {
            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

    getById(transactionId: string): Promise<ITransactionWithUserData<any>> {
        return this.getSingle({ id: transactionId });
    }

    getByUserAndId(userId: string, transactionId: string): Promise<ITransactionWithUserData<any>> {
        return this.getSingle({ id: transactionId, fromUser: userId });
    }

    getByProviderId(provider: string, providerTransactionId: string): Promise<ITransactionWithUserData> {
        return this.getSingle({ provider, providerTransactionId });
    }

    /**
     * retrieves a single transaction and attempts to updated
     * its status if it's still pending
     * @param filter 
     */
     private async getSingle(filter: ITransactionFilter): Promise<ITransactionWithUserData> {
        const [trx] = await this.get(filter);
        if (!trx) {
            throw createResourceNotFoundError("Transaction not found");
        }

        const updated = await this.updateTransactionStatus(trx);
        // merge the two so we can combine the updated fields
        // with the trx data that's not in the updated version
        return {
            ...trx,
            ...updated
        };
    }

    /**
     * Attempts to update the transaction status if it's still pending.
     * The transaction will be considered updated by the system.
     * @param trx 
     * @returns 
     */
    private async updateTransactionStatus(trx: ITransaction): Promise<ITransaction> {
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
                    updatedBy: getSystemPrincipal(),
                    amount: providerResult.amount
                }
            }, { returnDocument: 'after' });

        if (!updatedRes.value) throw createResourceNotFoundError("Transaction not found");
        return updatedRes.value;
    }

    private async create(args: CreateTransactionArgs, createdBy: IPrincipal): Promise<ITransaction> {
        const now = new Date();
        const tx: ITransaction = {
            _id: generateId(),
            ...args,
            amount: args.amount,
            status: args.status || 'pending',
            createdAt: now,
            updatedAt: now,
            createdBy: createdBy,
            updatedBy: createdBy,
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
            if (isMongoDuplicateKeyError(e, 'providerTransactionId')) {
                throw createUniquenessFailedError('The provider transaction reference ID is already registered.');
            }

            rethrowIfAppError(e);
            throw createDbError(e);
        }
    }

}


function isFinalStatus(status: TransactionStatus) {
    return status === 'failed' || status === 'success';
}
