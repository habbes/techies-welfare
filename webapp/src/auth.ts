import { IAuthService, MsalAuthService } from "./services";

const msalConfig = {
    auth: {
        clientId: '58b64109-904a-4592-bd20-3c8660e6e5b8',
        authority: 'https://login.microsoftonline.com/techieswelfare.onmicrosoft.com',
        redirectUri: 'http://localhost:3000/auth-response'
    }
};

const scopes = [
    'https://techieswelfare.onmicrosoft.com/toleoapi/Employe.Read.All',
    'email',
    'openid',
    'profile'
];

export const authService: IAuthService = new MsalAuthService(msalConfig, scopes);

