import { RequestHandler, ErrorRequestHandler } from "express";
import { sendErrorResponse } from "./util";
import { AppRequest } from "../server";

export const errorHandler = (): ErrorRequestHandler =>
    (error: Error, req, res, next) => {
        // TODO: proper logging
        console.log(error);
        return sendErrorResponse(res, 400, error);
    };

export const error404handler = (message: string): RequestHandler =>
    (req, res) => sendErrorResponse(res, 404, message);

interface WrappedHandler {
    (req: AppRequest): Promise<any>;
}

/**
 * this middleware calls the specified handler function and sends its return value
 * as the API response. It also sends errors from the function to the API error handler.
 *
 * this middleware was created to make it easier to write most handler functions, since
 * they happened to follow a common pattern
 *
 * @example
 * // the following code
 * router.get('endpoint/:id', (req, res, next) => {
 *   getById(req.params.id)
 *      .then(data => res.status(200).send(data))
 *      .catch(next);
 * });
 *
 * // can be rewritten as follows using this wrapResponse
 * router.get('endpoint/:id', wrapResponse((req) => getById(req.params.id)));
 *
 * @param handler
 * @param statusCode status code to send on success
 */
 export function wrapResponse(handler: WrappedHandler, statusCode = 200): RequestHandler {
    return (req: AppRequest, res, next) =>
        handler(req).then(result => res.status(statusCode).send(result))
            .catch(next);
}
