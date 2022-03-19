import Joi from "joi";

const PHONE_REGEX = /^\d+$/;

export const loginValidator = Joi.object({
    login: Joi.string().required(),
    otp: Joi.string(),
    password: Joi.string()
}).xor("otp", "password");

export const requestPassCodeValidator = Joi.object({
    login: Joi.string().required()
});

export const createUserValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(PHONE_REGEX).required(),
    team: Joi.string().allow(""),
    idNumber: Joi.string().allow(""),
    nextOfKin: Joi.object({
        name: Joi.string().allow(""),
        phone: Joi.string().regex(PHONE_REGEX).allow(""),
        email: Joi.string().email().allow(""),
        relationship: Joi.string().allow("")
    }),
    password: Joi.string(),
    memberSince: Joi.date().required().options({ convert: false })
});

