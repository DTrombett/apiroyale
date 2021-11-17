import { RiverRaceStanding } from "../structures";
import type { APIRiverRaceStanding, ClientRoyale } from "..";
import Manager from "./Manager";

/**
 * A manager for river race standings
 */
export class RiverRaceStandingManager extends Manager<
	typeof RiverRaceStanding
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIRiverRaceStanding[]) {
		super(client, RiverRaceStanding, data);
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
