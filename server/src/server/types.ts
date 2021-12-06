import { Request, Response } from "express";
import { IAppServices, IAuthContext, ICommandExecutor, ICommandContext } from "../core";

export interface AppRequest extends Request {
    appServices: IAppServices;
    authContext: IAuthContext;
    accessToken: string;
    commands: ICommandExecutor<ICommandContext>;
};

export interface AppResponse extends Response {}