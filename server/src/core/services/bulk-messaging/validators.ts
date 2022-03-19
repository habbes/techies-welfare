import Joi from "joi";

export const sendBulkMessageValidator = Joi.object({
    recipients: Joi.array().items(Joi.string()).required(),
    message: Joi.string().required()
});

export const previewMessageValidator = Joi.object({
    message: Joi.string().required()
});
