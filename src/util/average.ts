import type Collection from "@discordjs/collection";

/**
 * A function to get the average of an array or collection of numbers.
 * @param list - The array or collection to get the average of
 * @returns The average of the list
 */
export const average = (list: Collection<any, number> | number[]): number =>
	list.reduce((a, b) => a + b, 0) /
	((Array.isArray(list) ? list.length : list.size) || 1);

export default average;
