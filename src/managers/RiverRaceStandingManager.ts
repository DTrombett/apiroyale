import { RiverRaceWeekStanding } from "../structures";
import type { APIRiverRaceWeekStanding, ClientRoyale, RiverRace } from "..";
import Manager from "./Manager";

/**
 * A manager for river race standings
 */
export class RiverRaceStandingManager extends Manager<
	typeof RiverRaceWeekStanding
> {
	/**
	 * The race this manager belongs to
	 */
	race: RiverRace;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(
		client: ClientRoyale,
		race: RiverRace,
		data?: APIRiverRaceWeekStanding[]
	) {
		super(client, RiverRaceWeekStanding, data);

		this.race = race;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends RiverRaceWeekStanding = RiverRaceWeekStanding>(
		data: APIRiverRaceWeekStanding
	): S {
		const existing = this.get(data[RiverRaceWeekStanding.id].toString()) as
			| S
			| undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new RiverRaceWeekStanding(
			this.client,
			data,
			this.race
		) as S;
		this.set(achievement.id, achievement);
		this.client.emit("structureAdd", achievement);
		return achievement;
	}

	/**
	 * Removes a standing from the manager.
	 * @param rank - The rank of the standing to remove
	 * @returns The removed standing, if it exists
	 */
	remove(rank: string): RiverRaceWeekStanding | undefined {
		return super.remove(rank);
	}
}

export default RiverRaceStandingManager;
