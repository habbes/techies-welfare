import { IPrincipal } from ".";
import { createAppError } from "./error";

export function createUserPrincipal(id: string): IPrincipal {
    return { type: "user", _id: id };
}

export const getSystemPrincipal = (): IPrincipal => ({ type: "system", _id: "system" });

export type Role = 'admin' | 'member';

export type Permission = 
    'Messages.Preview'
    | 'Messages.Broadcast'
    | 'Users.Read.Self'
    | 'Users.Read.All'
    | 'Users.Create'
    | 'Users.Logout.Self'
    | 'Users.LogoutAll.Self'
    | 'Transactions.Read.All'
    | 'Transactions.Read.Self'
    | 'Transactions.Initiate.Self'
    | 'Transactions.Create';


const rolePermissions: Record<Role, Permission[]> = {
    'member': [
        'Users.Read.Self',
        'Users.Logout.Self',
        'Users.LogoutAll.Self',
        'Transactions.Read.Self',
        'Transactions.Initiate.Self',
    ],
    'admin': [
        'Messages.Preview',
        'Messages.Broadcast',
        'Users.Read.Self',
        'Users.Read.All',
        'Users.Create',
        'Users.Logout.Self',
        'Users.LogoutAll.Self',
        'Transactions.Read.All',
        'Transactions.Read.Self',
        'Transactions.Initiate.Self',
        'Transactions.Create'
    ]
};

export function getDefaultScopesForRole(roles: Role[]) {
    const scopes = roles.reduce((scopesSoFar, role) => {
        const scopesForRole = rolePermissions[role];

        if (!scopesForRole) {
            throw createAppError(`Could not get scopes for unknown role ${role}`);
        }

        return scopesSoFar.concat(scopesForRole);
    }, [] as Permission[]);

    return Array.from(new Set(scopes));
}