import { Express, Router } from "express";
import { createUser, getUsers, notifyUsers, previewMessage } from "../core";
import { error404handler, errorHandler, wrapResponse } from "./middleware";

const router = Router();

router.post("/notify-users",  wrapResponse(req =>
    req.commands.execute(notifyUsers, req.body)));

router.post("/preview-message",  wrapResponse(req => 
    req.commands.execute(previewMessage, req.body.message).then(message => ({ message }))));

router.post("/users", wrapResponse(req => 
    req.commands.execute(createUser, req.body)));

router.get("/users", wrapResponse(req =>
    req.commands.execute(getUsers, undefined)));

router.get("/users/:id", wrapResponse(req => req.appServices.users.getById(req.params.id)));
router.get("/users/:id/transactions", wrapResponse(req => req.appServices.transactions.getAllByUser(req.params.id)));

router.post("/users/:id/pay", wrapResponse(req => req.appServices.users.initiatePayment(req.params.id, req.body)));

router.post("/transactions", wrapResponse(req => req.appServices.transactions.createManualTransaction(req.body)));
router.get("/transactions", wrapResponse(req => req.appServices.transactions.getAll()));
router.get("/transactions/provider/:provider/:id",
    wrapResponse(req => req.appServices.transactions.getByProviderId(req.params.provider, req.params.id)));
router.get("/transactions/:id", wrapResponse(req => req.appServices.transactions.getById(req.params.id)));

router.use(errorHandler());
router.use(error404handler("Error not found."));

export { router };
