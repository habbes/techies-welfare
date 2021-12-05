import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export interface IAuthService {
    isAuthenticated(): boolean;
    getAccessToken(): Promise<string>;
    logout(): Promise<void>;
    login(): Promise<void>;
    handlePostLogin(): Promise<void>;
}

export class MsalAuthService implements IAuthService {
    private msal: PublicClientApplication;
    private scopes: string[];

    constructor(config: Configuration, scopes: string[]) {
        this.msal = new PublicClientApplication(config);
        this.scopes = scopes;
    }

    isAuthenticated(): boolean {
        return this.msal.getAllAccounts().length != 0;
    }

    async getAccessToken(): Promise<string> {
        if (!this.msal.getActiveAccount() && this.isAuthenticated()) {
            this.msal.setActiveAccount(this.msal.getAllAccounts()[0]);
        }

        const tokenResult = await this.msal.acquireTokenSilent({ scopes: this.scopes });
        return tokenResult.accessToken;
    }

    async logout(): Promise<void> {
        await this.msal.handleRedirectPromise();
        return this.msal.logoutRedirect();
    }

    async login(): Promise<void> {
        await this.msal.handleRedirectPromise(); // in case this is called after a redirect
        return this.msal.loginRedirect({ scopes: this.scopes })
    }

    async handlePostLogin(): Promise<void> {
        await this.msal.handleRedirectPromise();
    }
}