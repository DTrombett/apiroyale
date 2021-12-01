import type ClientRoyale from "..";
import type { APICurrentRiverRace } from "..";
import { CurrentRiverRace } from "../structures";
import { Routes } from "../util";
import FetchableManager from "./FetchableManager";

/**
 * A manager for clans current river races
 */
export class CurrentRiverRaceManager extends FetchableManager<
	typeof CurrentRiverRace
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APICurrentRiverRace[]) {
		super(client, CurrentRiverRace, {
			addEvent: "newCurrentRiverRace",
			data,
			removeEvent: "currentRiverRaceRemove",
			route: Routes.CurrentRiverRace,
			updateEvent: "currentRiverRaceUpdate",
		});
	}
}

export default CurrentRiverRaceManager;
