import { IAppServices } from "../core";
import { AppRequest } from "./types";
import { RequestHandler } from "express";

export function injectAppServices(services: IAppServices): RequestHandler {
    return (req: AppRequest, res, next) => {
        req.appServices = services;
        next();
    };
}
