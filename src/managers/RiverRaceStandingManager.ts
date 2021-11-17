import { RiverRaceStanding } from "../structures";
import type { APIRiverRaceStanding, ClientRoyale, RiverRace } from "..";
import Manager from "./Manager";

/**
 * A manager for river race standings
 */
export class RiverRaceStandingManager extends Manager<
	typeof RiverRaceStanding
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
		data?: APIRiverRaceStanding[]
	) {
		super(client, RiverRaceStanding, data);

		this.race = race;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends RiverRaceStanding = RiverRaceStanding>(
		data: APIRiverRaceStanding
	): S {
		const existing = this.get(data[RiverRaceStanding.id].toString()) as
			| S
			| undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new RiverRaceStanding(
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
	remove(rank: string): RiverRaceStanding | undefined {
		return super.remove(rank);
	}
}

export default RiverRaceStandingManager;
