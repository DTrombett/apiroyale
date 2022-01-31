import type { APIDate } from "..";

/**
 * Convert a date returned from the API to a Date object.
 * @param date - The date to convert
 * @returns The converted date
 */
export const APIDateToObject = (date: APIDate): Date =>
	new Date(
		Number(date.slice(0, 4)),
		Number(date.slice(4, 6)) - 1,
		Number(date.slice(6, 8)),
		Number(date.slice(9, 11)),
		Number(date.slice(11, 13)),
		Number(date.slice(13, 15))
	);

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
