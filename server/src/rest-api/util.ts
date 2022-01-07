import { Response } from "express";
import { AppError, getErrorMessage, createAppError } from "../core";

export function createErrorResponse(error: AppError) {
    return {
        message: getErrorMessage(error),
        code: error.code
    }
}

/**
* creates a default server error response body
*/
export const createServerError = () => {
    return createErrorResponse(createAppError("Server error occurred", "appError"));
};

export function sendErrorResponse(res: Response, status: number, error: AppError) {
    return res.status(status).send(createErrorResponse(error));
}

/**
* sends a server error response (status 500)
* @param res response object
*/
export const sendServerError = (res: Response) => {
    return res.status(500).send(createServerError());
};
