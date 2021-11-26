import Collection from "@discordjs/collection";
import type { APIPaging, ClientRoyale, ListMethod } from "..";
import { Errors } from "../util";

/**
 * Manage API lists
 * @template K - The key type of the list
 * @template V - The value type of the list
 */
export class List<K extends number | string, V> extends Collection<K, V> {
	/**
	 * The client that instantiated this list
	 */
	readonly client: ClientRoyale;

	/**
	 * The function used to get this list
	 */
	method: ListMethod<K, V>;

	/**
	 * The options used to get these results
	 */
	readonly options: Parameters<this["method"]>[0];

	/**
	 * The paging data
	 */
	readonly paging: APIPaging;

	/**
	 * @param client - The client that instantiated this list
	 * @param method - The function used to get this list
	 * @param options - The options used to get these results
	 * @param paging - The paging data
	 * @param data - The results provided by the API
	 */
	constructor(
		client: ClientRoyale,
		method: ListMethod<K, V>,
		options: Parameters<typeof method>[0],
		paging: APIPaging,
		data: [K, V][]
	) {
		super(data);

		this.client = client;
		this.method = method;
		this.options = options;
		this.paging = paging;
	}

	/**
	 * Fetch results after the current page.
	 * @param options - The options to add when fetching the results
	 * @returns A promise that resolves with the results
	 * @throws If there is no `after` cursor
	 */
	fetchNext(options: Record<string, unknown> = {}): Promise<List<K, V>> {
		const { after } = this.paging.cursors;

		if (after === undefined)
			return Promise.reject(new Error(Errors.missingAfter()));
		return this.method({
			...this.options,
			...options,
			after,
			before: undefined,
		});
	}

	/**
	 * Fetch results before the current page.
	 * @param options - The options to add when fetching the results
	 * @returns A promise that resolves with the results
	 * @throws If there is no `before` cursor
	 */
	fetchBefore(options: Record<string, unknown> = {}): Promise<List<K, V>> {
		const { before } = this.paging.cursors;

		if (before === undefined)
			return Promise.reject(new Error(Errors.missingBefore()));
		return this.method({
			...this.options,
			...options,
			before,
			after: undefined,
		});
	}
}

export default List;