import type { APIRiverRaceLogEntry } from "..";
import type ClientRoyale from "..";
import { FinishedRiverRace } from "../structures";
import Manager from "./Manager";

/**
 * A manager for river races
 */
export class RiverRaceManager extends Manager<typeof FinishedRiverRace> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIRiverRaceLogEntry[]) {
		super(client, FinishedRiverRace, data);
	}
}
