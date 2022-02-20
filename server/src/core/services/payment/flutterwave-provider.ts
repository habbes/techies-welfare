import * as axios from "axios";
import { createExternalServiceError } from "../..";
import { generateId } from "../../../util";
import { IUser, ITransaction, TransactionStatus } from "../../models";
import { IPaymentHandler, PaymentRequestResult, ProviderTransactionInfo } from "./types";

export const FLUTTERWAVE_PROVIDER_NAME = "flutterwave";
const API_BASE_URL = "https://api.flutterwave.com/v3"

export class FlutterwavePaymentProvider implements IPaymentHandler<FlutterwaveProviderMetadata, FlutterwaveNotification> {
    constructor(private args: FlutterwavePaymentProviderArgs) {
    }

    name(): string {
        return FLUTTERWAVE_PROVIDER_NAME;
    }

    async requestPaymentFromUser(user: IUser, amount: number): Promise<PaymentRequestResult<FlutterwaveProviderMetadata>> {
        const data = {
            // ideally tx_ref should be our transaction id
            // but since that isn't available to this method, we just generate a random unique id
            tx_ref: generateId(),
            amount,
            currency: "KES",
            payment_options: "card,mpesa",
            redirect_url: this.args.redirectUrl,
            customer: {
                email: user.email,
                phonenumber: convertPhoneNumberToFlwFormat(user.phone),
                name: user.name
            },
            customizations: {
                title: "Techies Welfare Group",
                description: "Techies Welfare Contribution",
                logo: this.args.logoUrl
            },
            meta: {
                userId: user._id
            }
        };

        try {
            const res = await axios.default.post<FlutterwaveInitiatePaymentResponse>(
                getUrl("/payments"),
                data,
                {
                    headers: {
                        Authorization: `Bearer ${this.args.secretKey}`
                    }
                }
            );

            return {
                providerTransactionId: data.tx_ref,
                status: res.data.status === 'success' ? 'pending' : 'failed',
                metadata: {
                    paymentUrl: res.data.data.link
                }
            }
        }
        catch (e) {
            throw createExternalServiceError(e, FLUTTERWAVE_PROVIDER_NAME);
        }
    }

    handlePaymentNotification(notification: FlutterwaveNotification): Promise<ProviderTransactionInfo<FlutterwaveProviderMetadata>> {
        const { data } = notification;

        return Promise.resolve(extractTransactionInfo(data));
    }

    async getTransaction(localTransaction: ITransaction<FlutterwaveProviderMetadata>): Promise<ProviderTransactionInfo<FlutterwaveProviderMetadata>> {
        if (!("id" in localTransaction.metadata)) {
            // if the transaction doesn't have an id in metadata,
            // then payment notification has not been received yet
            // in that case we assume the transaction is still pending
            return {
                status: localTransaction.status,
                metadata: localTransaction.metadata,
                amount: localTransaction.amount,
                providerTransactionId: localTransaction.providerTransactionId,
                failureReason: ""
            };
        }

        const id = localTransaction.metadata.id;

        try {
            const url = getUrl(`/transactions/${id}/verify`);
            const res = await axios.default.get<FlutterwaveTransactionResponse>(url, {
                headers: {
                    Authorization: `Bearer ${this.args.secretKey}`
                }
            });

            return extractTransactionInfo(res.data.data);
        }
        catch(e) {
            throw createExternalServiceError(e, FLUTTERWAVE_PROVIDER_NAME);
        }
    }
}

function getUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}

function extractTransactionInfo(data: FlutterwaveTransactionInfo): ProviderTransactionInfo<FlutterwaveTransactionInfo> {
    const flwStatus = data.status.toLowerCase();
    const status: TransactionStatus = 
        flwStatus === "successful" ? "success" :
        flwStatus === "failed" ? "failed" :
        "pending";

    return {
        providerTransactionId: data.tx_ref,
        metadata: data,
        status,
        failureReason: status === "failed" ? data.processor_response : "",
        amount: data.amount
    };
}

function convertPhoneNumberToFlwFormat(phone: string) {
    return `0${phone.substr(3)}`;
}

export type FlutterwaveProviderMetadata = FlutterwaveTransactionInfo | { paymentUrl: string };

export interface FlutterwavePaymentProviderArgs {
    secretKey: string;
    redirectUrl: string;
    logoUrl: string;
}

interface FlutterwaveTransactionInfo {
    id: string;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    amount_settled: number;
    status: string;
    payment_type: string;
    narration: string;
    processor_response: string;
    customer: {
        id: string;
        name: string;
        phone_number: string;
        created_at: string;
    }
}

export interface FlutterwaveNotification {
    event: string;
    'event.type': string;
    data: FlutterwaveTransactionInfo;
}

interface FlutterwaveInitiatePaymentResponse {
    status: string;
    message: string;
    data: {
        link: string;
    }
}

interface FlutterwaveTransactionResponse {
    status: string;
    message: string;
    data: FlutterwaveTransactionInfo;
}
