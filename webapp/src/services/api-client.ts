import axios, { AxiosInstance } from "axios";

interface InitiatePaymentArgs {
    userId: string;
    amount: number;
    type?: "contribution";
}

export class ApiClient {
    private httpClient: AxiosInstance;

    constructor(baseUrl: string) {
        this.httpClient = axios.create({ baseURL: baseUrl });
    }

    async initiatePayment({ userId, amount, type = 'contribution' }: InitiatePaymentArgs) {
        const res = await this.httpClient.post(`/users/${userId}/pay`, { amount, type });
        return res.data;
    }
}
