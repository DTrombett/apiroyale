import { URLSearchParams } from "node:url";
import type ClientRoyale from "..";
import type { APIClan, APIClanSearchResults, SearchClanOptions } from "..";
import { ClanSearchResults } from "../lists";
import { Clan } from "../structures";
import Constants, { Errors } from "../util";
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
		super(client, Clan, {
			addEvent: "newClan",
			data,
			removeEvent: "clanRemoved",
		});
	}

	/**
	 * Searches for a clan by name, location, members or score.
	 * @param options - The options for the search
	 * @returns The search results
	 * @throws {@link Errors.clanNameSearchTooShort} - If the clan name is too short
	 * @throws {@link Errors.clanMinMembersNotPositive} - If the the minimum number of members is not positive
	 * @throws {@link Errors.clanMaxMembersTooLow} - If the maximum number of members is less than the minimum
	 * @throws {@link Errors.clanMaxMembersNotPositive} - If the maximum number of members is not positive
	 * @throws {@link Errors.clanMinScoreNotPositive} - If the minimum score is not positive
	 * @throws {@link Errors.missingQuery} - If the query is missing
	 */
	async search(options: SearchClanOptions): Promise<ClanSearchResults> {
		const query = new URLSearchParams();

		if (options.name !== undefined) {
			if (options.name.length < Constants.minClanNameLength)
				return Promise.reject(new TypeError(Errors.clanNameSearchTooShort()));
			query.append("name", options.name);
		}
		if (options.location !== undefined)
			query.append(
				"locationId",
				typeof options.location === "string"
					? options.location
					: options.location.id
			);
		if (options.minMembers !== undefined) {
			if (options.minMembers < 1)
				return Promise.reject(
					new TypeError(Errors.clanMinMembersNotPositive())
				);
			query.append("minMembers", options.minMembers.toString());
		}
		if (options.maxMembers !== undefined) {
			if (options.maxMembers < (options.minMembers ?? 0))
				return Promise.reject(new TypeError(Errors.clanMaxMembersTooLow()));
			if (options.maxMembers < 1)
				return Promise.reject(
					new TypeError(Errors.clanMaxMembersNotPositive())
				);
			query.append("maxMembers", options.maxMembers.toString());
		}
		if (options.minScore !== undefined) {
			if (options.minScore < 1)
				return Promise.reject(new TypeError(Errors.clanMinScoreNotPositive()));
			query.append("minScore", options.minScore.toString());
		}

		if (query.toString() === "")
			return Promise.reject(new TypeError(Errors.missingQuery()));

		if (options.limit !== undefined)
			query.append("limit", options.limit.toString());
		if (options.after !== undefined) query.append("after", options.after);
		if (options.before !== undefined) query.append("before", options.before);

		const results = await this.client.api.get<APIClanSearchResults>("/clans", {
			query,
		});
		return new ClanSearchResults(this, options, results);
	}
}

export default ClanManager;
