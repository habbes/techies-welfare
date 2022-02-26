import { Express, Router } from "express";
import {
    createUser,
    getUsers,
    getMe,
    login,
    logout,
    logoutAll,
    notifyUsers,
    previewMessage,
    getMyTransactions,
    initiateTransaction,
    getMyAccountSummary,
    getUserById,
    getUserTransactions,
    createManualTransaction,
    getTransactions,
    getTransactionByProviderAndId,
    getTransactionById,
    getMyTransactionById,
    requestTemporaryPassCode
} from "../core";
import { requireAuth, wrapResponse } from "./middleware";

const router = Router();

router.post("/auth/login", wrapResponse(req =>
    req.commands.execute(login, req.body)));

router.post("/auth/request-otp", wrapResponse(req =>
    req.commands.execute(requestTemporaryPassCode, req.body)));

router.post("/auth/logout", requireAuth(), wrapResponse(req =>
    req.commands.execute(logout, req.accessToken)));

router.post("/auth/logout-all", requireAuth(), wrapResponse(req =>
    req.commands.execute(logoutAll, undefined)));

router.post("/notify-users", requireAuth(), wrapResponse(req =>
    req.commands.execute(notifyUsers, req.body)));

router.post("/preview-message", requireAuth(), wrapResponse(req => 
    req.commands.execute(previewMessage, req.body.message).then(message => ({ message }))));

router.post("/users", requireAuth(), wrapResponse(req => 
    req.commands.execute(createUser, req.body)));

router.get("/users", requireAuth(), wrapResponse(req =>
    req.commands.execute(getUsers, undefined)));

router.get("/me", requireAuth(), wrapResponse(req =>
    req.commands.execute(getMe, undefined)));

router.get("/me/transactions", requireAuth(), wrapResponse(req =>
    req.commands.execute(getMyTransactions, undefined)));

router.get("/me/transactions/:id", requireAuth(), wrapResponse(req =>
    req.commands.execute(getMyTransactionById, req.params.id)));

router.post("/me/pay", requireAuth(), wrapResponse(req =>
    req.commands.execute(initiateTransaction, req.body)));

router.get("/me/summary", requireAuth(), wrapResponse(req =>
    req.commands.execute(getMyAccountSummary, undefined)));

router.get("/users/:id", requireAuth(), wrapResponse(req =>
    req.commands.execute(getUserById, req.params.id)));

router.get("/users/:id/transactions", requireAuth(), wrapResponse(req =>
    req.commands.execute(getUserTransactions, req.params.id)));

router.post("/transactions", wrapResponse(req =>
    req.commands.execute(createManualTransaction, req.body)));

router.get("/transactions", wrapResponse(req => 
    req.commands.execute(getTransactions, undefined)));

router.get("/transactions/provider/:provider/:id",
    wrapResponse(req => req.commands.execute(getTransactionByProviderAndId,
        { provider: req.params.provider, id: req.params.id })));

router.get("/transactions/:id", wrapResponse(req =>
    req.commands.execute(getTransactionById, req.params.id)));

export { router };
