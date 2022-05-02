import { ICommandExecutor, CommandExecutor, ICommandGlobalPostMiddleware } from '../infra';
import { IAuthContext } from '../models';
import { IAppServices } from '../types';
import { logActivity } from './middleware';
import { ICommandContext } from './types';

const globalPostMiddleware: ICommandGlobalPostMiddleware<ICommandContext>[] =
    [logActivity()];

/**
 * Creates a command executor for executing app commands for the specified
 * `authContext`. A new executor should be created for each request, the
 * `authContext` represents the initiator of the request or command, e.g.
 * the user executing the request.
 * @param services 
 * @param authContext 
 * @returns 
 */
export function createCommandExecutor(services: IAppServices, authContext: IAuthContext): ICommandExecutor<ICommandContext> {
    return new CommandExecutor({ services, authContext }, {
        globalPostMiddleware
    });
}