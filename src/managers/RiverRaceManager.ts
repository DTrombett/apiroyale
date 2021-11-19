import type { APIRiverRaceLogEntry } from "..";
import type ClientRoyale from "..";
import { RiverRace } from "../structures";
import Manager from "./Manager";

/**
 * A manager for river races
 */
export class RiverRaceManager extends Manager<typeof RiverRace> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIRiverRaceLogEntry[]) {
		super(client, RiverRace, data);
	}
}
