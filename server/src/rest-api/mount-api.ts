import { Express } from "express";
import { router } from "./routes";

export function mountRestApi(server: Express, apiRoot: string) {
    server.use(apiRoot, router);
}
