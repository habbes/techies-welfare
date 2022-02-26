import { IAuthService } from './types';

const TOKEN_KEY = "authToken";

export class LocalAuthService implements IAuthService {
    constructor(private redirectLoginPage: () => any) {

    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(TOKEN_KEY);
        return !!token;
    }
    getAccessToken(): Promise<string> {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            throw new Error("Not authenticated");
        }

        return Promise.resolve(token);
    }

    setAccessToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    logout(): Promise<void> {
        localStorage.removeItem(TOKEN_KEY);
        this.redirectLoginPage();
        return Promise.resolve();
    }
    login(): Promise<void> {
        this.redirectLoginPage();
        return Promise.resolve();
    }
    handlePostLogin(): Promise<void> {
        return Promise.resolve();
    }

}