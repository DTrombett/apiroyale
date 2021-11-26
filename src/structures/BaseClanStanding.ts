import type { APIClanCurrentStanding, ClientRoyale } from "..";
import { RiverRaceParticipantManager } from "../managers";
import ClanPreview from "./ClanPreview";

/**
 * A base clan standing
 */
export class BaseClanStanding<
	T extends APIClanCurrentStanding = APIClanCurrentStanding
> extends ClanPreview<T> {
	/**
	 * The number of medals this clan has in the current day
	 */
	medals!: number;

	/**
	 * The participants to this war
	 */
	participants: RiverRaceParticipantManager;

	/**
	 * The clan's fame in the war
	 */
	points!: number;

	/**
	 * The clan's score
	 */
	score!: number;

	/**
	 * @param client - The client that instantiated this clan standing
	 * @param data - The data for this clan standing
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.participants = new RiverRaceParticipantManager(
			this.client,
			this,
			data.participants
		);
		this.patch(data);
	}

	/**
	 * Clone this standing
	 * @returns A clone of this standing
	 */
	clone(): BaseClanStanding<T> {
		return new BaseClanStanding(this.client, this.toJson());
	}

	/**
	 * Check if this standing is equal to another standing
	 * @param other - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(other: BaseClanStanding<T>): boolean {
		return (
			super.equals(other) &&
			this.score === other.score &&
			this.points === other.points &&
			this.medals === other.medals &&
			this.participants
				.mapValues((p) => p.tag)
				.equals(other.participants.mapValues((p) => p.tag))
		);
	}

	/**
	 * Patch this standing
	 * @param data - The data to patch the standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		if (data.clanScore !== undefined) this.score = data.clanScore;
		if (data.fame !== undefined) this.points = data.fame;
		if (data.participants !== undefined)
			for (const participant of data.participants)
				this.participants.add(participant);
		if (data.periodPoints !== undefined) this.medals = data.periodPoints;

		return this;
	}

	/**
	 * Gets a JSON representation of this standing
	 * @returns The JSON representation of this standing
	 */
	toJson(): APIClanCurrentStanding {
		return {
			...super.toJson(),
			clanScore: this.score,
			fame: this.points,
			participants: this.participants.map((p) => p.toJson()),
			periodPoints: this.medals,
			repairPoints: 0,
		};
	}
}

export default BaseClanStanding;
