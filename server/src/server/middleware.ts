import { CommandManager, IAppServices } from "../core";
import { AppRequest } from "./types";
import { RequestHandler } from "express";

export function injectAppServices(services: IAppServices): RequestHandler {
    return (req: AppRequest, res, next) => {
        req.appServices = services;
        const executor = new CommandManager(() => ({ services, authContext: req.authContext })).getExecutor();
        req.commands = executor;
        next();
    };
}
