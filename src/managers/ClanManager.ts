import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type {
	APIClan,
	APIClanList,
	APIClanMemberList,
	APIClanRanking,
	APIClanRankingList,
	APIPlayerRankingClan,
	APIRiverRaceClan,
	FetchOptions,
	ListOptions,
	SearchClanOptions,
	StructureOptions,
} from "..";
import Constants, { Errors } from "../util";
import { Manager } from "./Manager";

/**
 * A manager for clans
 */
export class ClanManager extends Manager<
	APIClan["tag"],
	| APIClan
	| APIClanList["items"][number]
	| APIClanRanking
	| APIPlayerRankingClan
	| APIRiverRaceClan
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

	add<
		T extends
			| APIClan
			| APIClanRanking
			| APIPlayerRankingClan
			| APIRiverRaceClan
			| Omit<
					APIClan,
					"clanChestPoints" | "clanChestStatus" | "description" | "memberList"
			  >
	>(key: string, value: T, options?: StructureOptions): T {
		if (options?.cacheNested ?? this.client.cacheOptions.cacheNested) {
			if ("memberList" in value)
				for (const member of value.memberList)
					this.client.players.add(member.tag, member, options);
			if ("location" in value)
				this.client.locations.add(value.location.id, value.location, options);
		}
		return super.add(key, value, options);
	}

	/**
	 * Get information about a single clan by clan tag.
	 * Clan tags can be found using clan search operation.
	 * @param tag - Tag of the clan
	 * @param options - Options for the request
	 * @returns The clan
	 */
	async fetch(tag: string, options: FetchOptions = {}): Promise<APIClan> {
		const existing = this.get(tag);

		if (
			existing &&
			options.force !== true &&
			"memberList" in existing &&
			!this.isOutdated(tag)
		)
			return existing;
		const clan = await this.client.api.get(Routes.Clan(tag));

		return this.add(clan.data.tag, clan.data, {
			maxAge: clan.maxAge,
			...options,
		});
	}

	/**
	 * List clan members.
	 * @param clanTag - Tag of the clan
	 * @param options - Options for the request
	 * @returns The clan members
	 */
	async fetchMembers(
		clanTag: string,
		options: ListOptions = {}
	): Promise<APIClanMemberList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const members = await this.client.api.get(Routes.ClanMembers(clanTag), {
			query,
		});

		for (const member of members.data.items)
			this.client.players.add(member.tag, member, { maxAge: members.maxAge, ...options });
		return members.data;
	}

	/**
	 * Get clan rankings for a specific location.
	 * @param locationId - Identifier of the location to retrieve
	 * @param options - Options for the request
	 * @returns The clan rankings
	 */
	async fetchRankings(
		locationId: number,
		options: ListOptions
	): Promise<APIClanRankingList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const rankings = await this.client.api.get(
			Routes.ClanRankings(locationId),
			{
				query,
			}
		);

		for (const clan of rankings.data.items)
			this.add(clan.tag, clan, { maxAge: rankings.maxAge, ...options });
		return rankings.data;
	}

	/**
	 * Get clan war rankings for a specific location.
	 * @param locationId - Identifier of the location to retrieve
	 * @param options - Options for the request
	 * @returns The clan war rankings
	 */
	async fetchWarRankings(
		locationId: number,
		options: ListOptions
	): Promise<APIClanRankingList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const rankings = await this.client.api.get(
			Routes.ClanWarRankings(locationId),
			{
				query,
			}
		);

		for (const clan of rankings.data.items)
			this.add(clan.tag, clan, { maxAge: rankings.maxAge, ...options });
		return rankings.data;
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
			this.add(clan.tag, clan, { maxAge: clans.maxAge, ...options });
		return clans.data;
	}
}

export default ClanManager;
