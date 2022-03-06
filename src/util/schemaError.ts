import type { ValidateFunction } from "ajv";

/**
 * Create a TypeError for a failed schema validation.
 * @param validate - The function that validated the schema
 * @param argument - The argument name validated
 * @param type - The expected type of the argument
 * @returns The TypeError
 */
export const schemaError = (
	validate: ValidateFunction,
	argument: string,
	type: string
): TypeError =>
	new TypeError(
		`'${argument}' must be a valid ${type}\n${
			validate.errors?.map((error) => error.message).join("\n") ?? ""
		}`
	);

export default schemaError;
