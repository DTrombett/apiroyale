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
	 * The number of medals this clan has earned
	 */
	medals!: number;

	/**
	 * The participants to this war
	 */
	readonly participants: RiverRaceParticipantManager;

	/**
	 * The clan's fame in the war
	 */
	points!: number;

	/**
	 * The clan's score
	 */
	score!: number;

	/**
	 * @param client - The client that instantiated this standing
	 * @param data - The data for this standing
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.participants = new RiverRaceParticipantManager(
			this.client,
			this,
			data.participants
		);
		this.patch({
			...data,
			participants: undefined,
		});
	}

	/**
	 * Clone this standing.
	 * @returns The cloned standing
	 */
	clone(): BaseClanStanding<T> {
		return new BaseClanStanding(this.client, this.toJson());
	}

	/**
	 * Check if this standing is equal to another standing.
	 * @param standing - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(standing: BaseClanStanding<T>): standing is this {
		return (
			super.equals(standing) &&
			this.medals === standing.medals &&
			this.participants.equals(standing.participants) &&
			this.points === standing.points &&
			this.score === standing.score
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch this standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		if (data.clanScore !== undefined) this.score = data.clanScore;
		if (data.fame !== undefined) this.points = data.fame;
		if (data.participants !== undefined)
			this.participants.add(...data.participants);
		if (data.periodPoints !== undefined) this.medals = data.periodPoints;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this standing.
	 * @returns The JSON representation of this standing
	 */
	toJson(): APIClanCurrentStanding {
		return {
			...super.toJson(),
			clanScore: this.score,
			fame: this.points,
			participants: this.participants.toJson(),
			periodPoints: this.medals,
			repairPoints: 0,
		};
	}
}

export default BaseClanStanding;
