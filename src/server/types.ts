import { Request, Response } from "express";
import { IAppServices, IUser } from "../core";

export interface AppRequest extends Request {
    appServices: IAppServices;
    user: IUser;
    accessToken: string;
};

export interface AppResponse extends Response {}