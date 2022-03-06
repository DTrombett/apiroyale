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

	declare readonly id: APITag;

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
	state: APIRiverRaceState;

	/**
	 * If the war is in the training phase or not
	 */
	type: APIRiverRacePeriodType;

	/**
	 * The progress of clans in this war for every war day
	 */
	readonly warDays: RiverRacePeriodManager;

	/**
	 * The number of week from the start of this month
	 */
	week: number;

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
		this.state = data.state;
		this.type = data.periodType;
		this.week = data.sectionIndex + 1;
	}

	/**
	 * The number of day from the start of this week
	 */
	get day(): number {
		return this.monthDay % 7 || 7;
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
			(this.state as string) === race.state &&
			this.type === race.type &&
			this.warDays.equals(race.warDays) &&
			this.week === race.week
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
		if (data.clans !== undefined) this.leaderboard.overrideItems(...data.clans);
		if (data.state !== undefined) this.state = data.state;
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex + 1;
		if (data.periodType !== undefined) this.type = data.periodType;
		if (data.periodLogs !== undefined)
			this.warDays.overrideItems(...data.periodLogs!);
		if (data.sectionIndex !== undefined) this.week = data.sectionIndex + 1;

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
			periodType: this.type,
			sectionIndex: this.week - 1,
			state: this.state,
		};
	}
}

export default CurrentRiverRace;
