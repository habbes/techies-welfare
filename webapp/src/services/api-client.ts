import axios, { AxiosInstance } from "axios";

interface InitiatePaymentArgs {
    userId: string;
    amount: number;
    type?: "contribution";
}

interface CreateUserArgs {
    email: string;
    name: string;
    phone: string;
    joinedAt: Date;
    team: string;
}

interface PreviewMessageArgs {
    message: string;
}

interface SendMessageArgs {
    recipients: string[];
    message: string;
}

export class ApiClient {
    private httpClient: AxiosInstance;

    constructor(baseUrl: string) {
        this.httpClient = axios.create({ baseURL: baseUrl });
    }

    async getAllUsers() {
        const res = await this.httpClient.get('/users');
        return res.data;
    }

    async getUserById(id: string) {
        const res = await this.httpClient.get(`/users/${id}`);
        return res.data;
    }

    async getUserTransactions(id: string) {
        const res = await this.httpClient.get(`/users/${id}/transactions`);
        return res.data;
    }

    async createUser(args: CreateUserArgs) {
        const res = await this.httpClient.post('/users', args);
        return res.data;
    }

    async initiatePayment({ userId, amount, type = 'contribution' }: InitiatePaymentArgs) {
        const res = await this.httpClient.post(`/users/${userId}/pay`, { amount, type });
        return res.data;
    }

    async previewMessage(args: PreviewMessageArgs) {
        const res = await this.httpClient.post('/preview-message', args);
        return res.data;
    }

    async sendMessage(args: SendMessageArgs) {
        const res = await this.httpClient.post('/notify-users', args);
        return res.data;
    }
}
