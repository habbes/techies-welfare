import Joi from "joi";

export const initiatePaymentValidator = Joi.object({
    amount: Joi.number().integer().greater(0).required(),
    type: Joi.string().valid('contribution').required()
});

export const createManualTransactionValidator = Joi.object({
    id: Joi.string().required(),
    fromUser: Joi.string().required(),
    amount: Joi.number().required(),
    metadata: Joi.object({
        details: Joi.string(),
        transactionDate: Joi.date().options({ convert: false }).required(),
    }).required()
});

export const getTransactionByProviderAndIdValidator = Joi.object({
    id: Joi.string().required(),
    provider: Joi.string().required()
});
