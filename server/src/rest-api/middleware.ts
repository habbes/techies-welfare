import { RequestHandler, ErrorRequestHandler } from "express";
import { sendErrorResponse, sendServerError } from "./util";
import { AppRequest } from "../server";
import { AppError, createInvalidTokenError, createValidationError, createResourceNotFoundError, IAppServices, CommandManager } from "../core";

export function injectAppServices(services: IAppServices): RequestHandler {
    return (req: AppRequest, res, next) => {
        req.appServices = services;
        next();
    };
}

export function injectAppCommands(): RequestHandler {
    return (req: AppRequest, res, next) => {
        const executor = new CommandManager(() => ({ services: req.appServices, authContext: req.authContext })).getExecutor();
        req.commands = executor;
        next();
    };
}

export const authenticate = (): RequestHandler =>
    async (req: AppRequest, res, next) => {
        const token = req.get('Authorization')?.split(/\s+/g)[1] || '';
        if (!token) {
            // we don't assume authentication is required here
            // that will be handled by the requireAuth middleware
            return next();
        }

        try {
            const user = await req.appServices.users.getByToken(token);
            req.accessToken = token;
            req.authContext = {
                user,
                scopes: user.scopes
            };

            next();
        }
        catch (e) {
            // if a token is provided, but is invalid, we return
            // an error whether or not the request requires authentication
            return next(e);
        }
    }

export const requireAuth = (): RequestHandler =>
    async (req: AppRequest, res, next) => {
        if (!req.authContext) {
            const err = createInvalidTokenError();
            return next(err);
        }

        return next();
    }

export const errorHandler = (): ErrorRequestHandler =>
    (error: AppError, req, res, next) => {
        // TODO: proper logging
        console.log(error);
        switch (error.code) {
            case 'resourceNotFound':
                return sendErrorResponse(res, 404, error);
            case 'uniquenessFailed':
                return sendErrorResponse(res, 409, error);
            case 'validationError':
                return sendErrorResponse(res, 400, error);
            case 'authError':
                return sendErrorResponse(res, 401, error);
            case 'permissionDenied':
                return sendErrorResponse(res, 403, error);
            default:
                if (error instanceof SyntaxError) {
                    return sendErrorResponse(res, 400,
                    createValidationError(`Invalid syntax in request body: ${error.message}`));
                }

                return sendServerError(res);
        }
    };

export const error404handler = (message: string): RequestHandler =>
    (req, res) => sendErrorResponse(res, 404, createResourceNotFoundError(message));

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
