import type { RiverRaceWeekStanding } from ".";
import type { APIClanWeekStanding, ClientRoyale } from "..";
import { APIDateToObject, dateObjectToAPIDate } from "..";
import BaseClanStanding from "./BaseClanStanding";

/**
 * A clan week standing
 */
export class ClanWeekStanding<
	T extends APIClanWeekStanding = APIClanWeekStanding
> extends BaseClanStanding<T> {
	/**
	 * When this clan finished the war
	 * * If the clan didn't finish the war or it's in the colosseum, this will be `null`
	 */
	finishedAt!: Date | null;

	/**
	 * The standing that this clan is in
	 */
	readonly standing: RiverRaceWeekStanding;

	/**
	 * @param client - The client that instantiated this clan standing
	 * @param data - The data for this clan standing
	 * @param standing - The standing that this clan is in
	 */
	constructor(client: ClientRoyale, data: T, standing: RiverRaceWeekStanding) {
		super(client, data);
		this.standing = standing;
		this.patch(data);
	}

	/**
	 * Clone this standing
	 * @returns A clone of this standing
	 */
	clone(): ClanWeekStanding<T> {
		return new ClanWeekStanding(this.client, this.toJson(), this.standing);
	}

	/**
	 * Check if this standing is equal to another standing
	 * @param other - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(other: ClanWeekStanding<T>): boolean {
		return (
			super.equals(other) &&
			this.finishedAt?.getTime() === other.finishedAt?.getTime() &&
			this.standing.rank === other.standing.rank
		);
	}

	/**
	 * Patch this standing
	 * @param data - The data to patch the standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		if (data.finishTime !== undefined)
			this.finishedAt = APIDateToObject(data.finishTime);

		return this;
	}

	/**
	 * Gets a JSON representation of this standing
	 * @returns The JSON representation of this standing
	 */
	toJson(): APIClanWeekStanding {
		return {
			...super.toJson(),
			finishTime: dateObjectToAPIDate(this.finishedAt),
		};
	}
}

export default ClanWeekStanding;
