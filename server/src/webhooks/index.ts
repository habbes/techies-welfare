import { Express, Router } from "express";
import { injectAppServices } from "../rest-api/middleware"; // TODO move the shared middleware to a more central location, e.g. server
import { IAppServices } from "../core";
import { flutterwaveRoutes } from "./flutterwave";

export function mountFlutterwaveWebhooks(server: Express, rootPath: string, services: IAppServices) {
    const router = Router();
    router.use(injectAppServices(services));
    router.use("/", flutterwaveRoutes);
    server.use(rootPath, router);
}
  