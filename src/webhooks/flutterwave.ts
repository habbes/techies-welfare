import express from 'express';
import { AppRequest } from '../server';
import { FLUTTERWAVE_PROVIDER_NAME } from '../core';

export const flutterwaveRoutes = express.Router();

flutterwaveRoutes.post('/', (req: AppRequest, res) => {
    const notification = req.body;
    console.log('Flutterwave payment notification', JSON.stringify(req.body, null, 2));
    req.appServices.transactions.handleProviderNotification(FLUTTERWAVE_PROVIDER_NAME, notification)
        .then(_ => res.status(200).send())
        .catch(e => {
            console.error('Flutterwave notification error', e);
            res.status(400).send();
        });
});