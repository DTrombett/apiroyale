import type ClientRoyale from "..";
import type { APIClanCurrentStanding, CurrentRiverRace } from "..";
import { ClanCurrentStanding } from "../structures";
import Manager from "./Manager";

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
				removeEvent: "clanCurrentStandingRemove",
				sortMethod: (a, b) => b.points - a.points || b.medals - a.medals,
				updateEvent: "clanCurrentStandingUpdate",
			},
			race
		);

		this.race = race;
	}
}

export default ClanCurrentStandingManager;
