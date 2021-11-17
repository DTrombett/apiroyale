import type { APIRiverRaceParticipant, RiverRaceStanding } from "..";
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
	 * The standing that this manager belongs to
	 */
	standing: RiverRaceStanding;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(
		client: ClientRoyale,
		standing: RiverRaceStanding,
		data?: APIRiverRaceParticipant[]
	) {
		super(client, RiverRaceParticipant, data);

		this.standing = standing;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends RiverRaceParticipant = RiverRaceParticipant>(
		data: APIRiverRaceParticipant
	): S {
		const existing = this.get(data[RiverRaceParticipant.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new RiverRaceParticipant(
			this.client,
			data,
			this.standing
		) as S;
		this.set(achievement.id, achievement);
		this.client.emit("structureAdd", achievement);
		return achievement;
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
