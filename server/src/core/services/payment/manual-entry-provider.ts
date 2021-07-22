import { generateId } from "../../../util";
import { IUser, ITransaction, TransactionStatus } from "../../models";
import { IPaymentHandler, PaymentRequestResult, ProviderTransactionInfo } from "./types";

export const MANUAL_ENTRY_PAYMENT_PROVIDER_NAME = "manual_entry";

export class ManualEntryPaymentProvider implements IPaymentHandler<ManualEntryTransactionMetadata, ManualEntryTransactionData> {
    name(): string {
        return MANUAL_ENTRY_PAYMENT_PROVIDER_NAME;
    }

    requestPaymentFromUser(user: IUser, amount: number): Promise<PaymentRequestResult<ManualEntryTransactionMetadata>> {
        // this provider is only used to manually record payments that were already made offline
        throw new Error("Method not implemented.");
    }

    handlePaymentNotification(notification: ManualEntryTransactionData): Promise<ProviderTransactionInfo<ManualEntryTransactionMetadata>> {
        return Promise.resolve({
            status: "success",
            amount: notification.amount,
            failureReason: "",
            providerTransactionId: notification.id,
            metadata: notification.metadata
        });
    }

    getTransaction(localTransaction: ITransaction<any>): Promise<ProviderTransactionInfo<ManualEntryTransactionMetadata>> {
        return Promise.resolve({
            status: localTransaction.status,
            amount: localTransaction.amount,
            failureReason: localTransaction.failureReason,
            providerTransactionId: localTransaction.providerTransactionId,
            metadata: localTransaction.metadata
        });
    }
    
}

export interface ManualEntryTransactionMetadata {
    /**
     * ID of the user who recorded this transaction in the system
     */
    recordedBy: string;
    /**
     * The date the transaction was made.
     */
    transactionDate: Date;
    /**
     * Additional details
     */
    details: string;
}

export interface ManualEntryTransactionData {
    id: string;
    fromUser: string;
    amount: number;
    metadata: ManualEntryTransactionMetadata;
}