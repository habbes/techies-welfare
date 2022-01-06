export interface IAuthService {
    isAuthenticated(): boolean;
    getAccessToken(): Promise<string>;
    logout(): Promise<void>;
    login(): Promise<void>;
    handlePostLogin(): Promise<void>;
}
