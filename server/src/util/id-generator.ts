import { randomBytes } from 'crypto';

export function generateId(): string {
    return randomBytes(16).toString('hex');
}

export function generateToken(): string {
    return randomBytes(64).toString('hex');
}
