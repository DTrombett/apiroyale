import type ClientRoyale from "..";
import type { APIRiverRacePeriod, CurrentRiverRace } from "..";
import { RiverRacePeriod } from "../structures";
import Manager from "./Manager";

/**
 * A manager for clans river race periods
 */
export class RiverRacePeriodManager extends Manager<typeof RiverRacePeriod> {
	/**
	 * The race of this manager
	 */
	race: CurrentRiverRace;

	/**
	 * @param client - The client that instantiated this manager
	 * @param race - The race of this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		race: CurrentRiverRace,
		data?: APIRiverRacePeriod[]
	) {
		super(
			client,
			RiverRacePeriod,
			{
				addEvent: "newRiverRacePeriod",
				data,
				removeEvent: "riverRacePeriodRemoved",
			},
			race
		);

		this.race = race;
	}
}

export default RiverRacePeriodManager;
