import type { APIRiverRaceParticipant, BaseClanStanding } from "..";
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
	standing: BaseClanStanding;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(
		client: ClientRoyale,
		clan: BaseClanStanding,
		data?: APIRiverRaceParticipant[]
	) {
		super(client, RiverRaceParticipant, data);

		this.standing = clan;
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
		const participant = new RiverRaceParticipant(
			this.client,
			data,
			this.standing
		) as S;
		this.set(participant.id, participant);
		this.client.emit("structureAdd", participant);
		return participant;
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
