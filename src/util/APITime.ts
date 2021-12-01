import type { APIDate } from "..";

/**
 * Convert a date returned from the API to a Date object.
 * @param date - The date to convert
 * @returns The converted date
 */
export const APIDateToObject = (date: APIDate): Date => {
	const time = new Date(0);

	time.setFullYear(
		Number(date.slice(0, 4)),
		Number(date.slice(4, 6)) - 1,
		Number(date.slice(6, 8))
	);
	time.setHours(
		// +1 because we want the time in UTC+1
		Number(date.slice(9, 11)) + 1,
		Number(date.slice(11, 13)),
		Number(date.slice(14, 15))
	);

	return time;
};

/**
 * Convert a date object to an API date.
 * @param date - The date to convert
 * @returns The converted date
 */
export const dateObjectToAPIDate = (date?: Date | null): APIDate =>
	date != null
		? (`${date.getFullYear()}${(date.getMonth() + 1)
				.toString()
				.padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}T${date
				.getHours()
				.toString()
				.padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
				.getSeconds()
				.toString()
				.padStart(2, "0")}.000Z` as APIDate)
		: "19691231T235959.000Z";
