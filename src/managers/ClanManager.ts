import type ClientRoyale from "..";
import type { APIClan, APIClanList, FetchOptions, SearchClanOptions } from "..";
import Constants, { Errors, Routes } from "../util";
import { Manager } from "./Manager";

/**
 * A manager for clans
 */
export class ClanManager extends Manager<
	APIClan["tag"],
	APIClan | APIClanList["items"][number]
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIClan[]) {
		super(
			client,
			{
				addEvent: "clanAdd",
				removeEvent: "clanRemove",
				updateEvent: "clanUpdate",
			},
			...data.map((clan) => [clan.tag, clan] as const)
		);
	}

	/**
	 * Get information about a single clan by clan tag.
	 * Clan tags can be found using clan search operation.
	 * @param tag - Tag of the clan
	 * @returns The clan
	 */
	async fetch(tag: string, options: FetchOptions = {}): Promise<APIClan> {
		const existing = this.get(tag);

		if (
			existing &&
			options.force !== undefined &&
			"memberList" in existing &&
			!this.isOutdated(tag)
		)
			return existing;
		const clan = await this.client.api.get(Routes.Clan(tag));

		return this.add(clan.data.tag, clan.data, {
			maxAge: clan.maxAge,
		});
	}

	/**
	 * Searches for a clan by name, location, members or score.
	 * @param options - The options for the search
	 * @returns The search results
	 * @throws {@link Errors.clanNameSearchTooShort} if the clan name is too short
	 * @throws {@link Errors.clanMinMembersNotPositive} if the the minimum number of members is not positive
	 * @throws {@link Errors.clanMaxMembersTooLow} if the maximum number of members is less than the minimum or is not positive
	 * @throws {@link Errors.clanMinScoreNotPositive} if the minimum score is not positive
	 * @throws {@link Errors.missingQuery} if the query is missing
	 */
	async search(options: SearchClanOptions): Promise<APIClanList> {
		const query: Record<string, string> = {};
		let hasQuery = false;

		if (options.name !== undefined) {
			if (options.name.length < Constants.minClanNameLength)
				throw new TypeError(Errors.clanNameSearchTooShort());
			query.name = options.name;
			hasQuery ||= true;
		}
		if (options.minMembers !== undefined) {
			if (options.minMembers < 1)
				throw new TypeError(Errors.clanMinMembersNotPositive());
			query.minMembers = options.minMembers.toString();
			hasQuery ||= true;
		}
		if (options.maxMembers !== undefined) {
			if (options.maxMembers < (options.minMembers ?? 1))
				throw new TypeError(Errors.clanMaxMembersTooLow());
			query.maxMembers = options.maxMembers.toString();
			hasQuery ||= true;
		}
		if (options.minScore !== undefined) {
			if (options.minScore < 1)
				throw new TypeError(Errors.clanMinScoreNotPositive());
			query.minScore = options.minScore.toString();
			hasQuery ||= true;
		}
		if (!hasQuery) throw new TypeError(Errors.missingQuery());
		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const clans = await this.client.api.get(Routes.Clans(), {
			query,
		});

		for (const clan of clans.data.items)
			this.add(clan.tag, clan, { maxAge: clans.maxAge });
		return clans.data;
	}
}

export default ClanManager;
