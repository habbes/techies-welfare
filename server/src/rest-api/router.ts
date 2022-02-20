import { Router } from "express";
import { IAppServices } from "../core";
import { authenticate, error404handler, errorHandler, injectAppCommands, injectAppServices, requireAuth, wrapResponse } from "./middleware";
import { router as routes } from "./routes";

export function createRouter(services: IAppServices): Router {
    const router = Router();
    // services are required by authentication so we inject them first
    router.use(injectAppServices(services));
    router.use(authenticate());
    // commands depend on authentication.
    // This specific ordering is required because the command executor
    // initializes the command context immediately it's created.
    // If the context was initialized lazily or per operation, this
    // wouldn't be necessary
    router.use(injectAppCommands());

    router.use("/", routes);

    router.use(errorHandler());
    router.use(error404handler("Error not found."));

    return router;
}