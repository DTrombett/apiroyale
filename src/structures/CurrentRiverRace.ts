import type ClientRoyale from "..";
import type {
	APICurrentRiverRace,
	APIRiverRacePeriodType,
	APIRiverRaceState,
	StringId,
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

	readonly id!: StringId;

	/**
	 * The leaderboard of clans in this race
	 */
	readonly leaderboard: ClanCurrentStandingManager;

	/**
	 * The number of war day from the start of this month
	 */
	monthDay!: number;

	/**
	 * The state of this race
	 */
	state!: RiverRaceState;

	/**
	 * If the war is in the training phase or not
	 */
	type!: RiverRacePeriodType;

	/**
	 * The progress of clans in this war for every war day
	 */
	readonly warDays: RiverRacePeriodManager;

	/**
	 * The number of war day from the start of this week
	 */
	weekDay!: number;

	/**
	 * @param client - The client that instantiated this race
	 * @param data - The data of the current river race
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.sectionIndex}`);
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
		this.patch({
			...data,
			clan: undefined,
			clans: undefined,
			periodLogs: undefined,
		});
	}

	/**
	 * Clone this race.
	 * @returns The cloned race
	 */
	clone(): CurrentRiverRace {
		return new CurrentRiverRace(this.client, this.toJson());
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
	 * Patch this race.
	 * @param data - The data to patch this race with
	 * @return The patched race
	 */
	patch(data: Partial<T>): this {
		if (data.clan !== undefined) this.clan.patch(data.clan);
		if (data.clans !== undefined) this.leaderboard.overrideItems(data.clans);
		if (data.state !== undefined) this.state = RiverRaceState[data.state];
		if (data.sectionIndex !== undefined) this.weekDay = data.sectionIndex;
		if (data.periodIndex !== undefined) this.monthDay = data.periodIndex;
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
	toJson(): APICurrentRiverRace {
		return {
			...super.toJson(),
			clan: this.clan.toJson(),
			clans: this.leaderboard.map((c) => c.toJson()),
			periodIndex: this.monthDay,
			periodLogs: this.warDays.map((p) => p.toJson()),
			periodType: RiverRacePeriodType[this.type] as APIRiverRacePeriodType,
			sectionIndex: this.weekDay,
			state: RiverRaceState[this.state] as APIRiverRaceState,
		};
	}
}

export default CurrentRiverRace;
