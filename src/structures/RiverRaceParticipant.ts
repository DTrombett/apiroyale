import type { Player, RiverRace, RiverRaceWeekStanding } from ".";
import type { APIRiverRaceParticipant, APITag, ClientRoyale } from "..";
import Structure from "./Structure";

/**
 * A river race participant
 */
export class RiverRaceParticipant extends Structure<APIRiverRaceParticipant> {
	static id = "tag" as const;

	/**
	 * The clan standing in the race related to this participant
	 */
	readonly standing: RiverRaceWeekStanding;

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
	 * The number of points this player has accumulated
	 */
	points: number;

	/**
	 * The player that refers to this participant
	 */
	player: Player;

	/**
	 * The race this participants belong to
	 */
	race: RiverRace;

	/**
	 * The tag of this participant
	 */
	tag: APITag;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data for this participant
	 * @param standing - The clan standing in the race related to this participant
	 */
	constructor(
		client: ClientRoyale,
		data: APIRiverRaceParticipant,
		standing: RiverRaceWeekStanding
	) {
		super(client, data);

		this.standing = standing;
		this.race = standing.race;
		this.boatAttacks = data.boatAttacks;
		this.decksUsed = data.decksUsed;
		this.decksUsedToday = data.decksUsedToday;
		this.points = data.fame;
		this.player = this.client.players.add<Player>(data);
		this.tag = data.tag;
	}

	/**
	 * The name of this participant
	 */
	get name(): string {
		return this.player.name;
	}

	/**
	 * Clone this participant.
	 */
	clone<T extends RiverRaceParticipant>(): T;
	clone(): RiverRaceParticipant {
		return new RiverRaceParticipant(this.client, this.toJson(), this.standing);
	}

	/**
	 * Checks whether this participant is equal to another, comparing all properties.
	 * @param participant - The participant to compare to
	 */
	equals(participant: RiverRaceParticipant): boolean {
		return (
			this.boatAttacks === participant.boatAttacks &&
			this.decksUsed === participant.decksUsed &&
			this.decksUsedToday === participant.decksUsedToday &&
			this.points === participant.points &&
			this.tag === participant.tag
		);
	}

	/**
	 * Patch this participant.
	 * @param data - The data to patch
	 * @returns The patched participant
	 */
	patch(data: Partial<RiverRaceParticipant>): this {
		const old = this.clone();
		super.patch(data);

		if (data.boatAttacks != null) this.boatAttacks = data.boatAttacks;
		if (data.decksUsed != null) this.decksUsed = data.decksUsed;
		if (data.decksUsedToday != null) this.decksUsedToday = data.decksUsedToday;
		if (data.points != null) this.points = data.points;

		if (!this.equals(old))
			this.client.emit("riverRaceParticipantUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this participant.
	 */
	toJson<R extends APIRiverRaceParticipant = APIRiverRaceParticipant>(): R;
	toJson(): APIRiverRaceParticipant {
		return {
			boatAttacks: this.boatAttacks,
			decksUsed: this.decksUsed,
			decksUsedToday: this.decksUsedToday,
			fame: this.points,
			tag: this.tag,
			repairPoints: 0,
			name: this.name,
		};
	}

	/**
	 * Gets a string representation of this standing.
	 */
	toString(): string {
		return this.name;
	}
}
