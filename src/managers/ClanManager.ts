import { URLSearchParams } from "node:url";
import type ClientRoyale from "..";
import type {
	APIClan,
	APIClanSearchResults,
	APITag,
	SearchClanOptions,
} from "..";
import { Errors, Constants } from "../util";
import { ClanSearchResults } from "../searchResults";
import { Clan } from "../structures";
import FetchableManager from "./FetchableManager";

/**
 * A manager for clans
 */
export class ClanManager extends FetchableManager<typeof Clan> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIClan[]) {
		super(client, Clan, data);
	}

	/**
	 * Removes a clan from this manager.
	 * @param id - The id of the clan to remove
	 * @returns The removed clan, if it exists
	 */
	remove(tag: APITag): Clan | undefined {
		return super.remove(tag);
	}

	/**
	 * Searches for a clan by name, location, members or score.
	 * @param options - The options for the search
	 * @returns The search results
	 */
	search(options: SearchClanOptions) {
		const query = new URLSearchParams();

		if (options.name !== undefined) {
			if (options.name.length < Constants.minClanNameLength)
				throw new TypeError(Errors.clanNameSearchTooShort());
			query.append("name", options.name);
		}
		if (options.location !== undefined)
			query.append(
				"locationId",
				typeof options.location === "string"
					? options.location
					: options.location.id
			);
		if (options.minMembers !== undefined)
			query.append("minMembers", options.minMembers.toString());
		if (options.maxMembers !== undefined)
			query.append("maxMembers", options.maxMembers.toString());
		if (options.minScore !== undefined)
			query.append("minScore", options.minScore.toString());
		if (options.limit !== undefined)
			query.append("limit", options.limit.toString());

		if (query.toString() === "") throw new TypeError(Errors.missingQuery());

		if (options.after !== undefined) query.append("after", options.after);
		if (options.before !== undefined) query.append("before", options.before);

		return this.client.api
			.get<APIClanSearchResults>("/clans", { query })
			.then((results) => new ClanSearchResults(this, options, results));
	}
}

export default ClanManager;
