import { Express, Router } from "express";
import { error404handler, errorHandler, wrapResponse } from "./middleware";

const router = Router();

interface BulkMessageRequest {
    recipients: string[];
    message: string;
}

router.post("/notify-users",  wrapResponse(req => {
    const body = req.body as BulkMessageRequest;
    return req.appServices.bulkMessages.send(body.recipients, body.message)
}));

router.post("/preview-message",  wrapResponse(req => 
    req.appServices.bulkMessages.previewMessage(req.body.message).then(message => ({ message }))));

router.post("/users", wrapResponse(req => req.appServices.users.create(req.body)));
router.get("/users", wrapResponse(req => req.appServices.users.getAll()));
router.get("/users/:id", wrapResponse(req => req.appServices.users.getById(req.params.id)));

router.use(errorHandler());
router.use(error404handler("Error not found."));

export { router };
