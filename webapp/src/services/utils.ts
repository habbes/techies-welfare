import { IUser } from ".";

/**
 * Returns the highest role of the
 * specified user.
 * @param user 
 * @returns The user's role
 */
export function getUserRole(user: IUser): string {
    if (user.roles.find(r => r === 'admin')) {
        return 'admin';
    }

    return 'member';
}

/**
 * Checks whether the user has an admin role
 * @param user 
 * @returns Whether user is an admin
 */
export function isUserAdmin(user: IUser) {
    return getUserRole(user) === 'admin';
}

export function getRoleDisplayName(role: string) {
    switch (role) {
        case 'admin':
            return 'Administrator';
        case 'member':
            return 'Member';
        default:
            return role;
    }
}

export function getDateTimeString(date: Date | string) {
    const convertedDate = typeof date === 'string' ? new Date(date) : date;
    return `${convertedDate.toLocaleDateString()} ${convertedDate.toLocaleTimeString()}`;
}