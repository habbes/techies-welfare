import { ObjectSchema, isSchema } from "joi";
import { createValidationError } from "../core";

type IValidatorFn = (value: any) => void;
export type IValidator = ObjectSchema | IValidatorFn;

/**
 * Validates the specified `value` using the given `validator`
 * and throws a validation value if the value is invalid.
 * @param validator Either a `Joi.ObjectSchema` object or a validator function
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