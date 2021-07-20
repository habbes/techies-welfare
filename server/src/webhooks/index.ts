import { Express } from "express";
import { flutterwaveRoutes } from "./flutterwave";

export function mountFlutterwaveWebhooks(server: Express, rootPath: string) {
    server.use(rootPath, flutterwaveRoutes);
}
  