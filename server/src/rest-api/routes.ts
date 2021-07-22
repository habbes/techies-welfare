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
router.get("/users/:id/transactions", wrapResponse(req => req.appServices.transactions.getAllByUser(req.params.id)));

router.post("/users/:id/pay", wrapResponse(req => req.appServices.users.initiatePayment(req.params.id, req.body)));

router.post("/transactions", wrapResponse(req => req.appServices.transactions.createManualTransaction(req.body)));
router.get("/transactions", wrapResponse(req => req.appServices.transactions.getAll()));
router.get("/transactions/:id", wrapResponse(req => req.appServices.transactions.getById(req.params.id)));

router.use(errorHandler());
router.use(error404handler("Error not found."));

export { router };
