/**
 * An example enum
 */
export enum Enum {}

/**
 * All the string values of the enum
 */
export type EnumString<E extends typeof Enum> = Exclude<E[keyof E], number>;

/**
 * Gets the corresponding enum number value for a given string.
 * @param enumType - The enum to get the values of
 * @param enumValue - The enum value to get the name of
 * @returns The correspondent number of the enum value
 */
export const getEnumNumber = <E extends typeof Enum>(
	enumType: E,
	enumValue: E[keyof E]
) =>
	typeof enumValue === "number"
		? enumValue
		: (enumType as unknown as Record<string, number>)[enumValue as string];

/**
 * Gets the corresponding enum string value for a given number.
 * @param enumType - The enum to get the values of
 * @param enumValue - The enum value to get the name of
 * @returns The correspondent string of the enum value
 */
export const getEnumString = <E extends typeof Enum>(
	enumType: E,
	enumValue: E[keyof E]
): EnumString<E> =>
	typeof enumValue === "string"
		? (enumValue as EnumString<E>)
		: (enumType as unknown as Record<number, EnumString<E>>)[
				enumValue as unknown as number
		  ];

export default Enum;
