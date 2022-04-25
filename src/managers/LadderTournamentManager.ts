import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type { APILadderTournament, FetchOptions } from "..";
import { Manager } from "./Manager";

/**
 * A manager for ladder tournaments
 */
export class LadderTournamentManager extends Manager<
	APILadderTournament["tag"],
	APILadderTournament
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APILadderTournament[]) {
		super(
			client,
			{
				addEvent: "ladderTournamentAdd",
				removeEvent: "ladderTournamentRemove",
				updateEvent: "ladderTournamentUpdate",
			},
			...data.map((tournament) => [tournament.tag, tournament] as const)
		);
	}

	/**
	 * Get list of global tournaments.
	 * @param options - Options for the request
	 * @returns The global tournaments
	 */
	async fetch(options: FetchOptions): Promise<APILadderTournament[]> {
		const existing = this.last();

		if (
			existing &&
			options.force !== undefined &&
			!this.isOutdated(existing.tag)
		)
			return this.array();
		const tournaments = await this.client.api.get(Routes.GlobalTournaments());

		for (const tournament of tournaments.data.items)
			this.add(tournament.tag, tournament, { maxAge: tournaments.maxAge });
		return tournaments.data.items;
	}
}

export default LadderTournamentManager;
