import type ClientRoyale from "..";
import type { APIRiverRacePeriod, CurrentRiverRace } from "..";
import { Manager } from "..";
import RiverRacePeriod from "../structures/RiverRacePeriod";

/**
 * A manager for clans current standings
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
		super(client, RiverRacePeriod, data);

		this.race = race;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends RiverRacePeriod = RiverRacePeriod>(
		data: APIRiverRacePeriod
	): S {
		const existing = this.get(data[RiverRacePeriod.id].toString()) as
			| S
			| undefined;
		if (existing != null) return existing.patch(data);
		const period = new RiverRacePeriod(this.client, data, this.race) as S;
		this.set(period.id, period);
		this.client.emit("structureAdd", period);
		return period;
	}

	/**
	 * Removes a clan from the manager.
	 * @param tag - The tag of the clan to remove
	 * @returns The removed clan, if it exists
	 */
	remove(tag: string): RiverRacePeriod | undefined {
		return super.remove(tag);
	}
}

export default RiverRacePeriodManager;
