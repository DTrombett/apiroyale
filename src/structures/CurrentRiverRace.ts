import Structure from ".";
import {
	APIRiverRacePeriodType,
	APIRiverRaceState,
	RiverRacePeriodType,
	RiverRaceState,
} from "..";
import type {
	APIClanCurrentStanding,
	APICurrentRiverRace,
	APIRiverRacePeriod,
} from "..";
import type ClientRoyale from "..";

/**
 * The current river race of a clan
 */
export class CurrentRiverRace<
	T extends APICurrentRiverRace = APICurrentRiverRace
> extends Structure<T> {
	static id = "periodIndex" as const;

	/**
	 * The clan of this race
	 */
	// TODO: Add a class for this
	clan!: APIClanCurrentStanding;

	/**
	 * The leaderboard of clans in this race
	 */
	// TODO: Add a class and a manager for this
	leaderboard: APIClanCurrentStanding[];

	/**
	 * The state of this race
	 */
	state!: RiverRaceState;

	/**
	 * The number of war day from the start of this week
	 */
	weekDay!: number;

	/**
	 * The number of war day from the start of this month
	 */
	monthDay!: number;

	/**
	 * If the war is in the training phase or not
	 */
	type!: RiverRacePeriodType;

	/**
	 * The progress of clans in this war for every war day
	 */
	// TODO: Add a class and a manager for this
	warDays: APIRiverRacePeriod[];

	/**
	 * @param client - The client that instantiated this race
	 * @param data - The data of the current river race
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.leaderboard = data.clans;
		this.warDays = data.periodLogs;
		this.patch(data);
	}

	/**
	 * Clone this race.
	 * @returns The cloned race
	 */
	clone(): CurrentRiverRace {
		return new CurrentRiverRace(this.client, this.toJson());
	}

	/**
	 * Checks whether this race is equal to another race, comparing all properties.
	 * @param other - The race to compare to
	 * @returns Whether the races are equal
	 */
	equals(other: CurrentRiverRace): boolean {
		return (
			super.equals(other) &&
			this.clan.tag === other.clan.tag &&
			// TODO: Add check for leaderboard
			this.state === other.state &&
			this.weekDay === other.weekDay &&
			this.monthDay === other.monthDay &&
			this.type === other.type
			// TODO: Add check for warDays
		);
	}

	/**
	 * Patch this race.
	 * @return The patched race
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.clan !== undefined) this.clan = data.clan;
		if (data.clans !== undefined) this.leaderboard = data.clans;
		if (data.state !== undefined) this.state = RiverRaceState[data.state];
		if (data.sectionIndex !== undefined) this.weekDay = data.sectionIndex;
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex;
		if (data.periodType !== undefined)
			this.type = RiverRacePeriodType[data.periodType];
		if (data.periodLogs !== undefined) this.warDays = data.periodLogs;

		if (!this.equals(old))
			this.client.emit("currentRiverRaceUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this race
	 * @returns The JSON representation of this race
	 */
	toJson(): APICurrentRiverRace {
		return {
			clan: this.clan,
			clans: this.leaderboard,
			periodIndex: this.monthDay,
			periodLogs: this.warDays,
			periodType: RiverRacePeriodType[this.type] as APIRiverRacePeriodType,
			sectionIndex: this.weekDay,
			state: RiverRaceState[this.state] as APIRiverRaceState,
		};
	}

	/**
	 * Gets a string representation of this race.
	 * @returns The day of this race
	 */
	toString(): string {
		return `${
			this.type === RiverRacePeriodType["training"] ? "Training" : "War"
		} Day ${this.weekDay}`;
	}
}

export default CurrentRiverRace;
