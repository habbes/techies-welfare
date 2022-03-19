import Joi from "joi";
import { createUserValidator } from "../user";

export const runSetupValidator = Joi.object({
    admin: createUserValidator.required()
});
