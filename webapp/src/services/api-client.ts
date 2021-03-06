import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IAuthService } from "./auth";
import { ITransaction, IUser } from "./types";

interface InitiatePaymentArgs {
    userId: string;
    amount: number;
    type?: "contribution";
}

interface CreateUserArgs {
    email: string;
    name: string;
    phone: string;
    memberSince: Date;
    team: string;
}

interface LoginArgs {
    login: string;
    password?: string;
    otp?: string;
}

interface LoginResult {
    user: {
        _id: string;
        name: string;
        roles: string[];
    };
    token: {
        _id: string;
    }
}

interface PreviewMessageArgs {
    message: string;
    subject?: string;
}

export interface PreviewMessageResult {
    message: string;
    subject: string;
}

interface SendMessageArgs {
    recipients: string[];
    message: string;
    subject?: string;
}

export interface ManualEntryTransactionArgs {
    id: string;
    fromUser: string;
    amount: number;
    metadata: {
        transactionDate: Date;
        details: string;
    }
}

export class ApiClient {
    private httpClient: AxiosInstance;

    constructor(baseUrl: string, authService: IAuthService) {
        this.httpClient = axios.create({ baseURL: baseUrl });

        this.httpClient.interceptors.request.use(async (config) => {
            if (authService.isAuthenticated()) {
                const accessToken = await authService.getAccessToken();
                const { headers: existingHeaders } = config;
                const newHeaders = {
                    ...existingHeaders,
                    Authorization: `Bearer ${accessToken}`
                };

                return { ...config, headers: newHeaders };
            }

            return config;
        })

        this.httpClient.interceptors.response.use(r => r, (error) => {
            if (authService.isAuthenticated()) {
                // logout the user if the token is invalid
                if (error.response.status === 401) {
                    authService.logout();
                }
            }

            throw error;
        });
    }

    getAllUsers() {
        return getData(this.httpClient.get('/users'));
    }

    getUserById(id: string) {
        return getData(this.httpClient.get(`/users/${id}`));
    }

    getLoggedInUser() {
        return getData<IUser>(this.httpClient.get(`/me`));
    }

    getMyTransactions() {
        return getData<ITransaction[]>(this.httpClient.get('/me/transactions'));
    }

    getMyTransactionById(id: string) {
        return getData<ITransaction>(this.httpClient.get(`/me/transactions/${id}`));
    }

    initiateMyPayment({ amount, type = 'contribution' }: { amount: number, type: string }) {
        return getData(this.httpClient.post('/me/pay', { amount, type }));
    }

    getMyAccountSummary() {
        return getData(this.httpClient.get('/me/summary'));
    }

    getUserTransactions(id: string) {
        return getData<ITransaction[]>(this.httpClient.get(`/users/${id}/transactions`));
    }

    createUser(args: CreateUserArgs) {
        return getData<IUser>(this.httpClient.post('/users', args));
    }

    login(args: LoginArgs): Promise<LoginResult> {
        return getData(this.httpClient.post('/auth/login', args));
    }

    requestOtp(args: { login: string }) {
        return getData(this.httpClient.post(`/auth/request-otp`, args));
    }

    makeUserAdmin(id: string) {
        return getData(this.httpClient.post(`/users/${id}/make-admin`));
    }

    getAllTransactions() {
        return getData<ITransaction[]>(this.httpClient.get('/transactions'));
    }

    getTransactionByProviderId(provider: string, providerTransactionId: string) {
        return getData<ITransaction>(this.httpClient.get(`/transactions/provider/${provider}/${providerTransactionId}`));
    }

    getTransactionById(id: string) {
        return getData<ITransaction>(this.httpClient.get(`/transactions/${id}`));
    }

    initiatePayment({ userId, amount, type = 'contribution' }: InitiatePaymentArgs) {
        return getData(this.httpClient.post(`/transactions/initiate`, { userId, amount, type }));
    }

    addManualPayment(args: ManualEntryTransactionArgs) {
        return getData(this.httpClient.post(`/transactions`, args));
    }

    previewMessage(args: PreviewMessageArgs) {
        return getData<PreviewMessageResult>(this.httpClient.post('/preview-message', args));
    }

    sendMessage(args: SendMessageArgs) {
        return getData(this.httpClient.post('/notify-users', args));
    }
}

async function getData<T = any>(responsePromise: Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const response = await responsePromise;
        return response.data;
    }
    catch (e: any) {
        throw e.response.data;
    }
}