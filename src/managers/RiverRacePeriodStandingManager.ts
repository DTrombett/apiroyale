import type ClientRoyale from "..";
import type { APIRiverRacePeriodStanding, RiverRacePeriod } from "..";
import { RiverRacePeriodStanding } from "../structures";
import Manager from "./Manager";

/**
 * A manager for clans river races period standings
 */
export class RiverRacePeriodStandingManager extends Manager<
	typeof RiverRacePeriodStanding
> {
	/**
	 * The period of this manager
	 */
	period: RiverRacePeriod;

	/**
	 * @param client - The client that instantiated this manager
	 * @param period - The period of this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		period: RiverRacePeriod,
		data?: APIRiverRacePeriodStanding[]
	) {
		super(
			client,
			RiverRacePeriodStanding,
			{
				addEvent: "newRiverRacePeriodStanding",
				data,
				removeEvent: "riverRacePeriodStandingRemove",
				updateEvent: "riverRacePeriodStandingUpdate",
			},
			period
		);

		this.period = period;
	}
}

export default RiverRacePeriodStandingManager;
