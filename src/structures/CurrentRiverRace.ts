import type ClientRoyale from "..";
import type {
	APICurrentRiverRace,
	APIRiverRacePeriodType,
	APIRiverRaceState,
	APITag,
	FetchOptions,
} from "..";
import {
	ClanCurrentStandingManager,
	RiverRacePeriodManager,
} from "../managers";
import { RiverRacePeriodType, RiverRaceState } from "../util";
import ClanCurrentStanding from "./ClanCurrentStanding";
import Structure from "./Structure";

/**
 * The current river race of a clan
 */
export class CurrentRiverRace<
	T extends APICurrentRiverRace = APICurrentRiverRace
> extends Structure<T> {
	/**
	 * The clan of this race
	 */
	readonly clan: ClanCurrentStanding;

	readonly id!: APITag;

	/**
	 * The leaderboard of clans in this race
	 */
	readonly leaderboard: ClanCurrentStandingManager;

	/**
	 * The number of war day from the start of this month
	 */
	monthDay: number;

	/**
	 * The state of this race
	 */
	state: RiverRaceState;

	/**
	 * If the war is in the training phase or not
	 */
	type: RiverRacePeriodType;

	/**
	 * The progress of clans in this war for every war day
	 */
	readonly warDays: RiverRacePeriodManager;

	/**
	 * The number of day from the start of this week
	 */
	weekDay: number;

	/**
	 * @param client - The client that instantiated this race
	 * @param data - The data of the current river race
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.clan.tag}`);

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
		this.monthDay = data.periodIndex + 1;
		this.state = RiverRaceState[data.state];
		this.type = RiverRacePeriodType[data.periodType];
		this.weekDay = data.sectionIndex || this.monthDay % 7;
	}

	/**
	 * The week number of this race
	 */
	get week(): number {
		return Math.ceil(this.monthDay / 7);
	}

	/**
	 * Clone this race.
	 * @returns The cloned race
	 */
	clone(): CurrentRiverRace {
		return new CurrentRiverRace(this.client, this.toJSON());
	}

	/**
	 * Check whether this race is equal to another race.
	 * @param race - The race to compare to
	 * @returns Whether the races are equal
	 */
	equals(race: CurrentRiverRace): race is this {
		return (
			super.equals(race) &&
			this.clan.id === race.clan.id &&
			this.leaderboard.equals(race.leaderboard) &&
			this.monthDay === race.monthDay &&
			this.state === race.state &&
			this.type === race.type &&
			this.warDays.equals(race.warDays) &&
			this.weekDay === race.weekDay
		);
	}

	/**
	 * Fetch this race.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new location
	 */
	fetch(options: FetchOptions): Promise<this> {
		return this.client.races.fetch<this>(this.id, options);
	}

	/**
	 * Patch this race.
	 * @param data - The data to patch this race with
	 * @return The patched race
	 */
	patch(data: Partial<T>): this {
		if (data.clan !== undefined) this.clan.patch(data.clan);
		if (data.clans !== undefined) this.leaderboard.overrideItems(data.clans);
		if (data.state !== undefined) this.state = RiverRaceState[data.state];
		if (data.sectionIndex !== undefined)
			this.weekDay = data.sectionIndex || this.monthDay % 7;
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex + 1;
		if (data.periodType !== undefined)
			this.type = RiverRacePeriodType[data.periodType];
		if (data.periodLogs !== undefined)
			this.warDays.overrideItems(data.periodLogs);

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this race
	 * @returns The JSON representation of this race
	 */
	toJSON(): APICurrentRiverRace {
		return {
			...super.toJSON(),
			clan: this.clan.toJSON(),
			clans: this.leaderboard.map((c) => c.toJSON()),
			periodIndex: this.monthDay - 1,
			periodLogs: this.warDays.map((p) => p.toJSON()),
			periodType: RiverRacePeriodType[this.type] as APIRiverRacePeriodType,
			sectionIndex: this.weekDay < 3 ? 0 : this.weekDay,
			state: RiverRaceState[this.state] as APIRiverRaceState,
		};
	}
}

export default CurrentRiverRace;
