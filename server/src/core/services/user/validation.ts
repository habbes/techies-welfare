import Joi from "joi";

export const loginValidator = Joi.object({
    login: Joi.string().required(),
    otp: Joi.string(),
    password: Joi.string()
}).xor("otp", "password");

export function validateLoginArgs(args: any) {
    Joi.assert(args, loginValidator);
}
