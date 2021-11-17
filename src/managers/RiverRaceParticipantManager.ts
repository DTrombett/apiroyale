import type { APIRiverRaceParticipant } from "..";
import type ClientRoyale from "..";
import Manager from "./Manager";
import { RiverRaceParticipant } from "../structures";

/**
 * A manager for river race participants
 */
export class RiverRaceParticipantManager extends Manager<
	typeof RiverRaceParticipant
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIRiverRaceParticipant[]) {
		super(client, RiverRaceParticipant, data);
	}

	/**
	 * Removes a participant from the manager.
	 * @param tag - The tag of the participant to remove
	 * @returns The removed participant, if it exists
	 */
	remove(tag: string): RiverRaceParticipant | undefined {
		return super.remove(tag);
	}
}
