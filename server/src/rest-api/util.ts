import { Response } from "express";
import { ErrorMessage, getErrorMessage } from "../core";

export function createErrorResponse(error: ErrorMessage) {
    return {
        message: getErrorMessage(error),
        code: "appError" // TODO use AppError code
    }
}

/**
* creates a default server error response body
*/
export const createServerError = () => {
    return createErrorResponse("Server error occurred");
};

export function sendErrorResponse(res: Response, status: number, error: string|Error) {
    return res.status(status).send(createErrorResponse(error));
}

/**
* sends a server error response (status 500)
* @param res response object
*/
export const sendServerError = (res: Response) => {
    return res.status(500).send(createServerError());
};
