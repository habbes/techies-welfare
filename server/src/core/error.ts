import { MongoError } from "mongodb";

export class AppError extends Error {
    public readonly code: AppErrorCode;
    constructor(message: string, code: AppErrorCode) {
        super(message);
        this.code = code;
    }
}

/**
 * Checks whether the error is a MongoDB duplicate key error
 * If a key is provided, then it also checks whether that was the key
 * that triggered the duplicate error.
 * @param error
 * @param key
 */
export function isMongoDuplicateKeyError(error: MongoError, key?: any): boolean {
    const MONGO_ERROR_DUPLICATE_KEY = 11000;
    if (error.code !== MONGO_ERROR_DUPLICATE_KEY) {
        return false;
    }
    
    if (typeof key === 'undefined') {
        return true;
    }

    return error.message.indexOf(key) > 0;
}

export type ErrorMessage = string | { message: string };

export const getErrorMessage = (message: ErrorMessage) => typeof message === 'string' ? message : message.message;

export type AppErrorCode = 
    // generic app error
    'appError'
    // DB error occurred when performing db operation
    | 'dbError'
    // Error occurred when connecting to database
    | 'dbConnectionError'
    | 'resourceNotFound'
    | 'uniquenessFailed'
    | 'validationError'
    // external API error
    | 'externalServiceError';



export function createAppError(message: ErrorMessage, code: AppErrorCode = 'appError'): AppError {
    return new AppError(getErrorMessage(message), code);
}

export function isAppError(e: unknown): boolean {
    return e instanceof AppError;
}

export function rethrowIfAppError(e: unknown) {
    if (isAppError(e)) throw e;
}

export const createDbError =
    (message: ErrorMessage) => createAppError(message, 'dbError');

export const createDbConnectionError =
    (message: ErrorMessage) => createAppError(message, 'dbConnectionError');

export const uniquenessFailedError =
    (message: ErrorMessage) => createAppError(message, 'uniquenessFailed');

export const createResourceNotFoundError =
    (message: ErrorMessage = 'Resource not found') => createAppError(message, 'uniquenessFailed');

export const createValidationError =
    (message: ErrorMessage) => createAppError(message, 'validationError');

export const createExternalServiceError =
    (message: ErrorMessage, serviceName: string) =>
        createAppError(`Service ${serviceName}: ${getErrorMessage(message)}`, 'externalServiceError');

