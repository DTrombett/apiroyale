import type ClientRoyale from "..";
import type { APIClanCurrentStanding, CurrentRiverRace } from "..";
import Manager from "../managers";
import { ClanCurrentStanding } from "../structures";

/**
 * A manager for clans current standings
 */
export class ClanCurrentStandingManager extends Manager<
	typeof ClanCurrentStanding
> {
	/**
	 * The race of this manager
	 */
	readonly race: CurrentRiverRace;

	/**
	 * @param client - The client that instantiated this manager
	 * @param race - The race of this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		race: CurrentRiverRace,
		data?: APIClanCurrentStanding[]
	) {
		super(
			client,
			ClanCurrentStanding,
			{
				addEvent: "newClanCurrentStanding",
				data,
				removeEvent: "clanCurrentStandingRemoved",
			},
			race
		);

		this.race = race;
	}
}

export default ClanCurrentStandingManager;
