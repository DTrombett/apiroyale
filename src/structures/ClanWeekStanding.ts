import type { APIRiverRaceClan, ClientRoyale, RiverRaceWeekStanding } from "..";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import BaseClanStanding from "./BaseClanStanding";

/**
 * A clan week standing
 */
export class ClanWeekStanding<
	T extends APIRiverRaceClan = APIRiverRaceClan
> extends BaseClanStanding<T> {
	/**
	 * When this clan finished the war
	 * * If the clan didn't finish the war or it's in the colosseum, this will be `null`
	 */
	finishedAt: Date | null;

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
		const finishedAt =
			data.finishTime !== undefined
				? APIDateToObject(data.finishTime)
				: undefined;
		super(client, data);

		this.standing = standing;
		this.finishedAt =
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			finishedAt?.getMonth() && finishedAt.getFullYear() >= 2000
				? finishedAt
				: null;
	}

	/**
	 * Clone this standing.
	 * @returns A clone of this standing
	 */
	clone(): ClanWeekStanding<T> {
		return new ClanWeekStanding(this.client, this.toJSON(), this.standing);
	}

	/**
	 * Check if this standing is equal to another standing.
	 * @param standing - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(standing: ClanWeekStanding<T>): standing is this {
		return (
			super.equals(standing) &&
			this.finishedAt?.getTime() === standing.finishedAt?.getTime() &&
			this.standing.id === standing.standing.id
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch this standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		if (data.finishTime !== undefined) {
			const finishedAt = APIDateToObject(data.finishTime);

			this.finishedAt = finishedAt.getTime() <= 0 ? null : finishedAt;
		}

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this standing.
	 * @returns The JSON representation of this standing
	 */
	toJSON(): APIRiverRaceClan {
		return {
			...super.toJSON(),
			finishTime: dateObjectToAPIDate(this.finishedAt),
		};
	}
}

export default ClanWeekStanding;
