import Structure from ".";
import type ClientRoyale from "..";
import type {
	APICurrentRiverRace,
	APIRiverRacePeriodType,
	APIRiverRaceState,
} from "..";
import {
	ClanCurrentStandingManager,
	RiverRacePeriodManager,
	RiverRacePeriodType,
	RiverRaceState,
} from "..";
import ClanCurrentStanding from "./ClanCurrentStanding";

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
	clan: ClanCurrentStanding;

	/**
	 * The leaderboard of clans in this race
	 */
	leaderboard: ClanCurrentStandingManager;

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
	warDays: RiverRacePeriodManager;

	/**
	 * @param client - The client that instantiated this race
	 * @param data - The data of the current river race
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.leaderboard = new ClanCurrentStandingManager(
			this.client,
			this,
			data.clans
		);
		this.warDays = new RiverRacePeriodManager(
			this.client,
			this,
			data.periodLogs
		);
		this.clan = new ClanCurrentStanding(this.client, data.clan, this);
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
			this.leaderboard
				.mapValues((clan) => clan.tag)
				.equals(other.leaderboard.mapValues((clan) => clan.tag)) &&
			this.state === other.state &&
			this.weekDay === other.weekDay &&
			this.monthDay === other.monthDay &&
			this.type === other.type &&
			this.warDays
				.mapValues((period) => period.monthDay)
				.equals(other.warDays.mapValues((period) => period.monthDay))
		);
	}

	/**
	 * Patch this race.
	 * @return The patched race
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.clan !== undefined) this.clan.patch(data.clan);
		if (data.clans !== undefined)
			for (const clan of data.clans) this.leaderboard.add(clan);
		if (data.state !== undefined) this.state = RiverRaceState[data.state];
		if (data.sectionIndex !== undefined) this.weekDay = data.sectionIndex;
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex;
		if (data.periodType !== undefined)
			this.type = RiverRacePeriodType[data.periodType];
		if (data.periodLogs !== undefined)
			for (const period of data.periodLogs) this.warDays.add(period);

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
			clan: this.clan.toJson(),
			clans: this.leaderboard.map((c) => c.toJson()),
			periodIndex: this.monthDay,
			periodLogs: this.warDays.map((p) => p.toJson()),
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
