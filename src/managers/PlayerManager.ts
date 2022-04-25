import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type {
	APIClanMember,
	APIPlayer,
	APIPlayerRanking,
	APIPlayerRankingList,
	FetchOptions,
	ListOptions,
	StructureOptions,
} from "..";
import { Manager } from "./Manager";

/**
 * A manager for players
 */
export class PlayerManager extends Manager<
	APIPlayer["tag"],
	APIClanMember | APIPlayer | APIPlayerRanking
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIPlayer[]) {
		super(
			client,
			{
				addEvent: "playerAdd",
				removeEvent: "playerRemove",
				updateEvent: "playerUpdate",
			},
			...data.map((player) => [player.tag, player] as const)
		);
	}

	add<T extends APIClanMember | APIPlayer | APIPlayerRanking>(
		key: string,
		value: T,
		options?: StructureOptions
	): T {
		if (options?.cacheNested ?? this.client.defaults.defaultCacheNested) {
			if ("clan" in value && value.clan)
				this.client.clans.add(value.clan.tag, value.clan, options);
			if (value.arena)
				this.client.arenas.add(value.arena.id, value.arena, options);
			if ("currentFavouriteCard" in value && value.currentFavouriteCard)
				this.client.cards.add(
					value.currentFavouriteCard.id,
					value.currentFavouriteCard,
					options
				);
		}
		return super.add(key, value, options);
	}

	/**
	 * Get information about a single player by player tag.
	 * Player tags can be found either in game or by from clan member lists.
	 * @param tag - Tag of the player
	 * @returns The player
	 */
	async fetch(tag: string, options: FetchOptions = {}): Promise<APIPlayer> {
		const existing = this.get(tag);

		if (
			existing &&
			options.force !== true &&
			"cards" in existing &&
			!this.isOutdated(tag)
		)
			return existing;
		const player = await this.client.api.get(Routes.Player(tag));

		return this.add(player.data.tag, player.data, {
			maxAge: player.maxAge,
		});
	}

	/**
	 * Get player rankings for a specific location.
	 * @param locationId - Identifier of the location to retrieve
	 * @param options - Options for the request
	 * @returns The player rankings
	 */
	async fetchRankings(
		locationId: number,
		options: ListOptions = {}
	): Promise<APIPlayerRankingList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const rankings = await this.client.api.get(
			Routes.PlayerRankings(locationId),
			{
				query,
			}
		);

		for (const player of rankings.data.items)
			this.add(player.tag, player, { maxAge: rankings.maxAge });
		return rankings.data;
	}

	/**
	 * Get top player rankings for a season.
	 * @param seasonId - Identifier of the season to retrieve
	 * @param options - Options for the request
	 * @returns The player rankings
	 */
	async fetchSeasonRankings(
		seasonId: string,
		options: ListOptions = {}
	): Promise<APIPlayerRankingList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const rankings = await this.client.api.get(
			Routes.TopPlayerRankings(seasonId),
			{
				query,
			}
		);

		for (const player of rankings.data.items)
			this.add(player.tag, player, { maxAge: rankings.maxAge });
		return rankings.data;
	}
}

export default PlayerManager;
