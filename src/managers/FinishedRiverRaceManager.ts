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
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIRiverRaceLogEntry[]) {
		super(client, FinishedRiverRace, {
			addEvent: "newFinishedRiverRace",
			data,
			removeEvent: "finishedRiverRaceRemove",
			updateEvent: "finishedRiverRaceUpdate",
		});
	}
}
