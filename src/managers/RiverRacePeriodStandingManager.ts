import type ClientRoyale from "..";
import type { APIRiverRacePeriodStanding, RiverRacePeriod } from "..";
import { Manager } from "..";
import RiverRacePeriodStanding from "../structures/RiverRacePeriodStanding";

/**
 * A manager for clans current standings
 */
export class RiverRacePeriodStandingManager extends Manager<
	typeof RiverRacePeriodStanding
> {
	/**
	 * The race of this manager
	 */
	period: RiverRacePeriod;

	/**
	 * @param client - The client that instantiated this manager
	 * @param period - The race of this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		period: RiverRacePeriod,
		data?: APIRiverRacePeriodStanding[]
	) {
		super(client, RiverRacePeriodStanding, data);

		this.period = period;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends RiverRacePeriodStanding = RiverRacePeriodStanding>(
		data: APIRiverRacePeriodStanding
	): S {
		const existing = this.get(data[RiverRacePeriodStanding.id].toString()) as
			| S
			| undefined;
		if (existing != null) return existing.patch(data);
		const standing = new RiverRacePeriodStanding(
			this.client,
			data,
			this.period
		) as S;
		this.set(standing.id, standing);
		this.client.emit("structureAdd", standing);
		return standing;
	}

	/**
	 * Removes a clan from the manager.
	 * @param tag - The tag of the clan to remove
	 * @returns The removed clan, if it exists
	 */
	remove(tag: string): RiverRacePeriodStanding | undefined {
		return super.remove(tag);
	}
}

export default RiverRacePeriodStandingManager;
