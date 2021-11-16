import Collection from "@discordjs/collection";
import type { APIPaging, ClientRoyale } from "..";
import { Errors } from "../util";

type ListMethod<K extends number | string, V> = (
	options: { [k: string]: any; after?: string; before?: string },
	...args: any[]
) => Promise<List<K, V>>;

/**
 * A class to manage API lists
 */
export class List<K extends number | string, V> extends Collection<K, V> {
	/**
	 * The client that instantiated this
	 */
	readonly client: ClientRoyale;

	/**
	 * The paging data
	 */
	readonly paging: APIPaging;

	/**
	 * Options used to get these results
	 */
	options: Parameters<this["method"]>[0];

	/**
	 * The function to get this list
	 */
	method: ListMethod<K, V>;

	/**
	 * @param client - The client that instantiated this
	 * @param method - The function to get this list
	 * @param options - The options used to get these results
	 * @param data - The data to create the results from
	 * @param paging - The paging data
	 */
	constructor(
		client: ClientRoyale,
		method: ListMethod<K, V>,
		options: Parameters<typeof method>[0],
		data: [K, V][],
		paging: APIPaging
	) {
		super(data);

		this.client = client;
		this.paging = paging;
		this.options = options;
		this.method = method;
	}

	/**
	 * Fetch results after the current page
	 * @returns A promise that resolves with the results
	 */
	fetchNext(): Promise<List<K, V>> {
		const { after } = this.paging.cursors;

		if (after === undefined)
			return Promise.reject(new Error(Errors.missingAfter()));
		return this.method({
			...this.options,
			after,
		});
	}

	/**
	 * Fetch results before the current page
	 * @returns A promise that resolves with the results
	 */
	fetchBefore(): Promise<List<K, V>> {
		const { before } = this.paging.cursors;

		if (before === undefined)
			return Promise.reject(new Error(Errors.missingBefore()));
		return this.method({
			...this.options,
			before,
		});
	}
}

export default List;
