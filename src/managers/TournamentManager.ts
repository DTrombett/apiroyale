import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type {
	APITournament,
	APITournamentHeaderList,
	FetchOptions,
	SearchTournamentOptions,
} from "..";
import Constants, { Errors } from "../util";
import { Manager } from "./Manager";

/**
 * A manager for tournaments
 */
export class TournamentManager extends Manager<
	APITournament["tag"],
	APITournament | APITournamentHeaderList["items"][number]
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APITournament[]) {
		super(
			client,
			{
				addEvent: "tournamentAdd",
				removeEvent: "tournamentRemove",
				updateEvent: "tournamentUpdate",
			},
			...data.map((tournament) => [tournament.tag, tournament] as const)
		);
	}

	/**
	 * Get information about a single tournament by a tournament tag.
	 * @param tag - Tag of the tournament to retrieve
	 * @returns The tournament
	 */
	async fetch(tag: string, options: FetchOptions = {}): Promise<APITournament> {
		const existing = this.get(tag);

		if (
			existing &&
			options.force !== true &&
			"membersList" in existing &&
			!this.isOutdated(tag)
		)
			return existing;
		const tournament = await this.client.api.get(Routes.Tournament(tag));

		return this.add(tournament.data.tag, tournament.data, {
			maxAge: tournament.maxAge,
			...options,
		});
	}

	/**
	 * Searches for a tournament by name, location, members or score.
	 * @param options - The options for the search
	 * @returns The search results
	 * @throws {@link Errors.tournamentNameSearchTooShort} if the clan name is too short
	 * @throws {@link Errors.missingQuery} if the query is missing
	 */
	async search(
		options: SearchTournamentOptions
	): Promise<APITournamentHeaderList> {
		const query: Record<string, string> = {};
		let hasQuery = false;

		if (options.name !== undefined) {
			if (options.name.length < Constants.minTournamentNameLength)
				throw new TypeError(Errors.tournamentNameSearchTooShort());
			query.name = options.name;
			hasQuery ||= true;
		}
		if (!hasQuery) throw new TypeError(Errors.missingQuery());
		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const tournaments = await this.client.api.get(Routes.Tournaments(), {
			query,
		});

		for (const tournament of tournaments.data.items)
			this.add(tournament.tag, tournament, {
				maxAge: tournaments.maxAge,
				...options,
			});
		return tournaments.data;
	}
}

export default TournamentManager;
