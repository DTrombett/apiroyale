import Collection from "@discordjs/collection";
import type { APIPaging, ClientRoyale, Manager, StructureType } from "..";
import { Errors } from "../util";

/**
 * A class to manage search results
 */
export class SearchResults<
	T extends Manager & {
		search(options: {
			before: string;
			after: string;
		}): Promise<SearchResults<T>>;
	}
> extends Collection<string, T["structure"]["prototype"]> {
	/**
	 * The client that instantiated this search
	 */
	readonly client: ClientRoyale;

	/**
	 * The manager for this search
	 */
	readonly manager: T;

	/**
	 * Data for the paging
	 */
	readonly paging: APIPaging;

	/**
	 * The query used to get these results
	 */
	options: Parameters<T["search"]>[0];

	/**
	 * The structure class these results are for
	 */
	readonly structure: T["structure"];

	/**
	 * @param manager - The manager for this search
	 * @param options - The options used to get these results
	 * @param data - The data to create the results from
	 */
	constructor(
		manager: T,
		structure: T["structure"],
		options: SearchResults<T>["options"],
		data: { items: StructureType<typeof structure>[]; paging: APIPaging }
	) {
		super(
			data.items.map((APIInstance) => {
				const instance = manager.add(APIInstance);

				return [instance.id, instance];
			})
		);

		this.client = manager.client;
		this.manager = manager;
		this.paging = data.paging;
		this.options = options;
		this.structure = manager.structure;
	}

	/**
	 * Fetch results after the current page
	 * @returns A promise that resolves with the results
	 */
	fetchNext() {
		const { after } = this.paging.cursors;

		if (after === undefined)
			return Promise.reject(new Error(Errors.missingAfter()));
		return this.manager.search({ ...this.options, after });
	}

	/**
	 * Fetch results before the current page
	 * @returns A promise that resolves with the results
	 */
	fetchBefore() {
		const { before } = this.paging.cursors;

		if (before === undefined)
			return Promise.reject(new Error(Errors.missingBefore()));
		return this.manager.search({ ...this.options, before });
	}
}

export default SearchResults;
