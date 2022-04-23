import type ClientRoyale from "..";
import type { APIRiverRaceLogEntry } from "..";
import { FinishedRiverRace } from "../structures";
import Manager from "./Manager";

/**
 * A manager for finished river races
 */
export class FinishedRiverRaceManager extends Manager<
	typeof FinishedRiverRace
> {
	/**
	 * The clan tag this manager is for
	 */
	clanTag: string;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		clanTag: string,
		data?: APIRiverRaceLogEntry[]
	) {
		super(
			client,
			FinishedRiverRace,
			{
				addEvent: "newFinishedRiverRace",
				data,
				removeEvent: "finishedRiverRaceRemove",
				sortMethod: (a, b) => b.seasonId - a.seasonId,
				updateEvent: "finishedRiverRaceUpdate",
			},
			clanTag
		);

		this.clanTag = clanTag;
	}
}
