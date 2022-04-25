import type ClientRoyale from "..";
import type {
	APILadderTournamentRanking,
	APILadderTournamentRankingList,
	Collection,
	ListOptions,
} from "..";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for ladder tournament rankings
 */
export class LadderTournamentRankingManager extends Manager<
	`${string}-${APILadderTournamentRanking["tag"]}`,
	APILadderTournamentRanking
> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "ladderTournamentRankingAdd",
			updateEvent: "ladderTournamentRankingUpdate",
			removeEvent: "ladderTournamentRankingRemove",
		});
	}

	/**
	 * Get global tournament rankings.
	 * @param tournamentTag - Tag of the tournament to retrieve
	 * @param options - Options for the request
	 * @returns The ladder tournament rankings
	 */
	async fetch(
		tournamentTag: string,
		options: ListOptions = {}
	): Promise<APILadderTournamentRankingList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const list = await this.client.api.get(
			Routes.GlobalTournamentRankings(tournamentTag),
			{
				query,
			}
		);

		for (const ranking of list.data.items)
			this.add(`${tournamentTag}-${ranking.tag}`, ranking, {
				maxAge: list.maxAge,
			});
		return list.data;
	}

	/**
	 * Filter the entries for a specific tournament from the cache.
	 * @param tournamentTag - Tag of the tournament to retrieve
	 * @returns The filtered entries
	 */
	for(
		tournamentTag: string
	): Collection<
		`${string}-${APILadderTournamentRanking["tag"]}`,
		APILadderTournamentRanking
	> {
		return this.filter((_, key) => key.startsWith(tournamentTag));
	}
}

export default LadderTournamentRankingManager;
