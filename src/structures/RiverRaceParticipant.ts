import type { BaseClanStanding } from ".";
import type { APIRiverRaceParticipant, ClientRoyale, Player } from "..";
import BasePlayer from "./BasePlayer";

/**
 * A river race participant
 */
export class RiverRaceParticipant<
	T extends APIRiverRaceParticipant = APIRiverRaceParticipant
> extends BasePlayer<T> {
	/**
	 * The clan standing in the race related to this participant
	 */
	readonly clan: BaseClanStanding;

	/**
	 * The number of boat attacks this player has made
	 */
	boatAttacks: number;

	/**
	 * The number of decks this player has used in the race
	 */
	decksUsed: number;

	/**
	 * The number of decks this player has used today
	 * * Note: This is always 0 for river race logs
	 */
	decksUsedToday: number;

	/**
	 * The fame of this participant
	 */
	medals: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data for this participant
	 * @param clan - The clan standing in the race related to this participant
	 */
	constructor(client: ClientRoyale, data: T, clan: BaseClanStanding) {
		super(client, data);

		this.clan = clan;
		this.boatAttacks = data.boatAttacks;
		this.decksUsed = data.decksUsed;
		this.decksUsedToday = data.decksUsedToday;
		this.medals = data.fame;
	}

	/**
	 * The player that this participant is related to
	 */
	get player(): Player | null {
		return this.client.players.get(this.tag) ?? null;
	}

	/**
	 * Clone this participant.
	 */
	clone(): RiverRaceParticipant {
		return new RiverRaceParticipant(this.client, this.toJson(), this.clan);
	}

	/**
	 * Check whether this participant is equal to another.
	 * @param participant - The participant to compare to
	 */
	equals(participant: RiverRaceParticipant): participant is this {
		return (
			this.boatAttacks === participant.boatAttacks &&
			this.decksUsed === participant.decksUsed &&
			this.decksUsedToday === participant.decksUsedToday &&
			this.medals === participant.medals &&
			this.tag === participant.tag
		);
	}

	/**
	 * Patch this participant.
	 * @param data - The data to patch this participant with
	 * @returns The patched participant
	 */
	patch(data: Partial<T>): this {
		if (data.boatAttacks != null) this.boatAttacks = data.boatAttacks;
		if (data.decksUsed != null) this.decksUsed = data.decksUsed;
		if (data.decksUsedToday != null) this.decksUsedToday = data.decksUsedToday;
		if (data.fame != null) this.medals = data.fame;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this participant.
	 */
	toJson(): APIRiverRaceParticipant {
		return {
			boatAttacks: this.boatAttacks,
			decksUsed: this.decksUsed,
			decksUsedToday: this.decksUsedToday,
			fame: this.medals,
			tag: this.tag,
			repairPoints: 0,
			name: this.name,
		};
	}
}
