import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type {
	APILeagueSeason,
	APILeagueSeasonList,
	FetchOptions,
	ListOptions,
} from "..";
import { Manager } from "./Manager";

/**
 * A manager for league seasons
 */
export class LeagueSeasonManager extends Manager<
	APILeagueSeason["id"],
	APILeagueSeason
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APILeagueSeason[]) {
		super(
			client,
			{
				addEvent: "leagueSeasonAdd",
				removeEvent: "leagueSeasonRemove",
				updateEvent: "leagueSeasonUpdate",
			},
			...data.map((item) => [item.id, item] as const)
		);
	}

	/**
	 * Get top player league season.
	 * @param id - Identifier of the season to retrieve
	 * @param options - Options for the request
	 * @returns The season
	 */
	fetch(id: string, options?: FetchOptions): Promise<APILeagueSeason>;
	/**
	 * Lists top player league seasons.
	 * @param options - Options for the request
	 * @returns The seasons
	 */
	fetch(options?: ListOptions): Promise<APILeagueSeasonList>;
	async fetch(
		idOrOptions: ListOptions | string = {},
		options: FetchOptions = {}
	): Promise<APILeagueSeason | APILeagueSeasonList> {
		if (typeof idOrOptions === "string") {
			const existing = this.get(idOrOptions);

			if (existing && options.force !== true && !this.isOutdated(idOrOptions))
				return existing;
			const season = await this.client.api.get(Routes.Season(idOrOptions));

			return this.add(season.data.id, season.data, {
				maxAge: season.maxAge,
			});
		}
		const query: Record<string, string> = {};

		if (idOrOptions.limit !== undefined)
			query.limit = idOrOptions.limit.toString();
		if (idOrOptions.after !== undefined) query.after = idOrOptions.after;
		if (idOrOptions.before !== undefined) query.before = idOrOptions.before;
		const seasons = await this.client.api.get(Routes.Seasons(), {
			query,
		});

		for (const season of seasons.data.items)
			this.add(season.id, season, { maxAge: seasons.maxAge });
		return seasons.data;
	}
}

export default LeagueSeasonManager;
