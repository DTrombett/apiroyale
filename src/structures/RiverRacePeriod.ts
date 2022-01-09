import type ClientRoyale from "..";
import type { APIRiverRacePeriod, CurrentRiverRace, StringId } from "..";
import { RiverRacePeriodStandingManager } from "../managers";
import Structure from "./Structure";

/**
 * A river race period
 */
export class RiverRacePeriod<
	T extends APIRiverRacePeriod = APIRiverRacePeriod
> extends Structure<T> {
	declare readonly id: StringId;

	/**
	 * The leaderboard of this period
	 */
	readonly leaderboard: RiverRacePeriodStandingManager;

	/**
	 * The month day of this period
	 */
	monthDay: number;

	/**
	 * The race of this period
	 */
	readonly race: CurrentRiverRace;

	/**
	 * @param client - The client that instantiated this period
	 * @param data - The data of the period
	 * @param race - The race of this period
	 */
	constructor(client: ClientRoyale, data: T, race: CurrentRiverRace) {
		super(client, data, `${data.periodIndex}`);

		this.race = race;
		this.leaderboard = new RiverRacePeriodStandingManager(
			this.client,
			this,
			data.items
		);
		this.monthDay = data.periodIndex;
	}

	/**
	 * The number of day from the start of this week
	 */
	get day(): number {
		return (this.monthDay % 7) - 2;
	}

	/**
	 * The week number of this period
	 */
	get week(): number {
		return Math.ceil(this.monthDay / 7);
	}

	/**
	 * Clone this period.
	 * @returns The cloned period
	 */
	clone(): RiverRacePeriod<T> {
		return new RiverRacePeriod(this.client, this.toJSON(), this.race);
	}

	/**
	 * Check if this period is equal to another.
	 * @param period - The other period
	 * @returns Whether this period is equal to the other period
	 */
	equals(period: RiverRacePeriod<T>): period is this {
		return (
			super.equals(period) &&
			this.leaderboard.equals(period.leaderboard) &&
			this.monthDay === period.monthDay &&
			this.race.id === period.race.id
		);
	}

	/**
	 * Patch this clan.
	 * @param data - The data to patch this clan with
	 * @returns The new clan
	 */
	patch(data: Partial<T>): this {
		if (data.items !== undefined) this.leaderboard.overrideItems(data.items);
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJSON(): APIRiverRacePeriod {
		return {
			...super.toJSON(),
			items: this.leaderboard.toJSON(),
			periodIndex: this.monthDay,
		};
	}
}

export default RiverRacePeriod;
