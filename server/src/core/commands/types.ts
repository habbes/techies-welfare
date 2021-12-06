import { IAuthContext } from "../models";
import { IAppServices } from "../types";

export interface ICommandContext {
    services: IAppServices;
    authContext: IAuthContext;
}
