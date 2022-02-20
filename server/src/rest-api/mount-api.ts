import { Express } from "express";
import { IAppServices } from "../core";
import { createRouter } from "./router";

export function mountRestApi(server: Express, apiRoot: string, services: IAppServices) {
    const router = createRouter(services);
    server.use(apiRoot, router);
}
