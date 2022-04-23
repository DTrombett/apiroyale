import type ClientRoyale from "..";
import type { APIPeriodLogEntry, RiverRacePeriod } from "..";
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
		data?: APIPeriodLogEntry[]
	) {
		super(
			client,
			RiverRacePeriodStanding,
			{
				addEvent: "newRiverRacePeriodStanding",
				data,
				removeEvent: "riverRacePeriodStandingRemove",
				sortMethod: (a, b) => a.rank - b.rank,
				updateEvent: "riverRacePeriodStandingUpdate",
			},
			period
		);

		this.period = period;
	}
}

export default RiverRacePeriodStandingManager;
