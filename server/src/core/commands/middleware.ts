import { IValidator, validateWith } from "../../util";
import { Permission } from "../auth";
import { createPermissionError } from "../error";
import { ICommandGlobalPostMiddleware, ICommandPostMiddleware, ICommandPreMiddleware } from "../infra";
import { ICommandContext } from "./types";

export function requireScopes<TInput>(...scopes: Permission[]): ICommandPreMiddleware<TInput, ICommandContext> {
    return (input, context) => {
        if (!(context.authContext && context.authContext.scopes)) {
            throw createPermissionError();
        }

        if (scopes.every(scope => !context.authContext.scopes.includes(scope))) {
            throw createPermissionError();
        }

        return Promise.resolve();
    }
}

export function validate<TInput>(validator: IValidator): ICommandPreMiddleware<TInput, ICommandContext> {
    return (input, context) => {
        validateWith(validator, input);
        return Promise.resolve();
    }
}

export function logActivity(): ICommandGlobalPostMiddleware<ICommandContext> {
    return (input, result, context) => {
        // implement activity logging
        return Promise.resolve();
    }
}