import { Permission } from "../auth";
import { createPermissionError } from "../error";
import { ICommandMiddleware } from "../infra";
import { ICommandContext } from "./types";

export function requireScopes<TInput>(...scopes: Permission[]): ICommandMiddleware<TInput, ICommandContext> {
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