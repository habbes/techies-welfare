import Joi, { isSchema, Schema } from "joi";
import { createValidationError } from "../core";

type IValidatorFn = (value: any) => void;

/**
 * Either a `Joi.Schema` object or a validator function
 * that throws a validation error iff the value is invalid.
 */
export type IValidator = Schema | IValidatorFn;

/**
 * Validates the specified `value` using the given `validator`
 * and throws a validation value if the value is invalid.
 * @param validator Either a `Joi.Schema` object or a validator function
 * that throws a validation error iff the value is invalid.
 * @param value 
 * @returns 
 */
export function validateWith(validator: IValidator, value: any): void {
    if (isSchema(validator)) {
        const { error } = validator.validate(value);
        if (error) {
            throw createValidationError(error);
        }

        return;
    }

    validator(value);
}

export const stringValidator = Joi.string().required();
