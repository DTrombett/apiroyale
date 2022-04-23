import type { APIPaging, ListMethod } from "..";
import { ClientRoyale } from "..";
import { Collection, Errors } from "../util";
import schemaError from "../util/schemaError";
import { validateAPIPaging, validateListOptions } from "../util/schemas";

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
		paging: APIPaging = { cursors: {} },
		data: [K, V][]
	) {
		super(data);
		if (!(client instanceof ClientRoyale))
			throw new TypeError("Argument 'client' must be a ClientRoyale");
		if (typeof method !== "function")
			throw new TypeError("Argument 'method' must be a function");
		if (!validateListOptions(options))
			throw schemaError(validateListOptions, "options", "ListOptions");
		if (!validateAPIPaging(paging))
			throw schemaError(validateAPIPaging, "paging", "APIPaging");
		if (!Array.isArray(data))
			throw new TypeError("Argument 'data' must be an array");

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
