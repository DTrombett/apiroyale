import Structure from "./Structure";
import type { APIRiverRacePeriod, ClientRoyale } from "..";
import type { CurrentRiverRace } from ".";
import RiverRacePeriodStandingManager from "../managers/RiverRacePeriodStandingManager";

/**
 * A clan preview
 */
export class RiverRacePeriod<
	T extends APIRiverRacePeriod = APIRiverRacePeriod
> extends Structure<T> {
	static id = "periodIndex" as const;

	/**
	 * The race of this period
	 */
	race: CurrentRiverRace;

	/**
	 * The leaderboard of this period
	 */
	leaderboard: RiverRacePeriodStandingManager;

	/**
	 * The month day of this period
	 */
	monthDay: number;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 * @param race - The race of this period
	 */
	constructor(client: ClientRoyale, data: T, race: CurrentRiverRace) {
		super(client, data);
		this.race = race;
		this.leaderboard = new RiverRacePeriodStandingManager(
			this.client,
			this,
			data.items
		);
		this.monthDay = data.periodIndex;
		this.patch(data);
	}

	/**
	 * Clone this clan preview.
	 * @returns The cloned clan preview
	 */
	clone(): RiverRacePeriod<T> {
		return new RiverRacePeriod(this.client, this.toJson(), this.race);
	}

	/**
	 * Checks if this clan is equal to another.
	 * @param other - The other clan
	 * @returns Whether this clan is equal to the other clan
	 */
	equals(other: RiverRacePeriod<T>): boolean {
		return super.equals(other);
	}

	/**
	 * Patches this clan.
	 * @param data - The data to patch
	 * @returns The new clan
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		return this;
	}

	/**
	 * Gets a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJson(): APIRiverRacePeriod {
		return {
			...super.toJson(),
			items: this.leaderboard.map((standing) => standing.toJson()),
			periodIndex: this.monthDay,
		};
	}

	/**
	 * Gets a string representation of this clan.
	 * @returns The string representation of this clan
	 */
	toString(): string {
		return this.monthDay.toString();
	}
}

export default RiverRacePeriod;
