import type ClientRoyale from "..";
import type { APIRiverRaceParticipant, BaseClanStanding } from "..";
import { RiverRaceParticipant } from "../structures";
import Manager from "./Manager";

/**
 * A manager for river race participants
 */
export class RiverRaceParticipantManager extends Manager<
	typeof RiverRaceParticipant
> {
	/**
	 * The standing that this manager belongs to
	 */
	clan: BaseClanStanding;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(
		client: ClientRoyale,
		clan: BaseClanStanding,
		data?: APIRiverRaceParticipant[]
	) {
		super(
			client,
			RiverRaceParticipant,
			{
				addEvent: "newRiverRaceParticipant",
				data,
				removeEvent: "riverRaceParticipantRemoved",
			},
			clan
		);

		this.clan = clan;
	}
}
