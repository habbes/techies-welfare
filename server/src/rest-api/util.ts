import { Response } from "express";

export function createErrorResponse(error: string|Error) {
    if (typeof error === "string") {
        return {
            message: error,
            code: "error"
        }
    }

    return {
        message: error.message,
        code: "error" // TODO use AppError code
    }
}

export function sendErrorResponse(res: Response, status: number, error: string|Error) {
    return res.status(status).send(createErrorResponse(error));
}
