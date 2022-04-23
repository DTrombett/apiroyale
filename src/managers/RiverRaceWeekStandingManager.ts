import type { APIRiverRaceStanding, ClientRoyale, FinishedRiverRace } from "..";
import { RiverRaceWeekStanding } from "../structures";
import Manager from "./Manager";

/**
 * A manager for river races week standings
 */
export class RiverRaceWeekStandingManager extends Manager<
	typeof RiverRaceWeekStanding
> {
	/**
	 * The race this manager belongs to
	 */
	race: FinishedRiverRace;

	/**
	 * @param client - The client that instantiated this manager
	 * @param race - The race this manager belongs to
	 * @param data - The data to initialize the manager with
	 */
	constructor(
		client: ClientRoyale,
		race: FinishedRiverRace,
		data?: APIRiverRaceStanding[]
	) {
		super(
			client,
			RiverRaceWeekStanding,
			{
				addEvent: "newRiverRaceWeekStanding",
				data,
				removeEvent: "riverRaceWeekStandingRemove",
				sortMethod: (a, b) => a.rank - b.rank,
				updateEvent: "riverRaceWeekStandingUpdate",
			},
			race
		);

		this.race = race;
	}
}

export default RiverRaceWeekStandingManager;
