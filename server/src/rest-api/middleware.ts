import { RequestHandler, ErrorRequestHandler } from "express";
import { sendErrorResponse, sendServerError } from "./util";
import { AppRequest } from "../server";
import { AppError, createInvalidTokenError, createValidationError, createResourceNotFoundError, IAppServices, CommandManager } from "../core";

/**
 * This makes the core app services available to the
 * request via `req.appServices`.
 * These services are intended to be used by other middleware and should
 * not be directly used by request handlers. Request handlers
 * should use `req.commands` instead.
 */
export function injectAppServices(services: IAppServices): RequestHandler {
    return (req: AppRequest, res, next) => {
        req.appServices = services;
        next();
    };
}

/**
 * This makes the core app commands available to the request
 * via `req.commands`. Request handlers should prefer
 * using `req.commands` to execute core business logic.
 * Using `req.commands` will ensure that authorization,
 * validation, auditing, etc. and other concerns are properly applied.
 * 
 * This middleware should be applied after the `authenticate` middleware
 */
export function injectAppCommands(): RequestHandler {
    return (req: AppRequest, res, next) => {
        const executor = new CommandManager(() => ({ services: req.appServices, authContext: req.authContext })).getExecutor();
        req.commands = executor;
        next();
    };
}

/**
 * This validates the auth token if set and makes
 * the auth context available to the request via
 * `req.authContext`
 * 
 * This middleware should be applied after `injectServices` middleware
 */
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
                user: user,
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

/**
 * This ensures that a user is authenticated before
 * proceeding with the request, otherwise returns a 401
 * error response.
 * 
 * This should be used on routes where authentication is required.
 */
export const requireAuth = (): RequestHandler =>
    async (req: AppRequest, res, next) => {
        if (!req.authContext) {
            const err = createInvalidTokenError();
            return next(err);
        }

        return next();
    }

/**
 * This middleware handles errors from requests
 * and an error response with a corresponding
 * status code.
 * 
 * Request handlers should not handle errors.
 * This global error handler should be used instead.
 */
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

/**
 * This returns a 404 error if a route that does
 * not exist is requested
 * @param message error message used in the error response
 */
export const error404handler = (message: string): RequestHandler =>
    (req, res) => sendErrorResponse(res, 404, createResourceNotFoundError(message));

interface WrappedHandler {
    (req: AppRequest): Promise<any>;
}

/**
 * This middleware calls the specified handler function and sends its return value
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
