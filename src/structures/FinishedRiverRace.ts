import type {
	APIRiverRaceLogEntry,
	APITag,
	Clan,
	ClanPreview,
	ClanResultPreview,
	ClientRoyale,
	StringId,
} from "..";
import { RiverRaceWeekStandingManager } from "../managers";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import Structure from "./Structure";

/**
 * A finished river race
 */
export class FinishedRiverRace<
	T extends APIRiverRaceLogEntry = APIRiverRaceLogEntry
> extends Structure<T> {
	/**
	 * The tag of the clan this race is for
	 */
	readonly clanTag: APITag;

	/**
	 * When this race has ended
	 */
	finishTime: Date;

	declare readonly id: `${StringId}-${StringId}`;

	/**
	 * A leaderboard of clans in this race
	 */
	readonly leaderboard: RiverRaceWeekStandingManager;

	/**
	 * The season id of this race
	 */
	seasonId: number;

	/**
	 * The number of the week of this race
	 */
	weekNumber: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data of the river race
	 */
	constructor(client: ClientRoyale, data: T, clanTag: APITag) {
		super(client, data, `${data.seasonId}-${data.sectionIndex}`);

		this.clanTag = clanTag;
		this.leaderboard = new RiverRaceWeekStandingManager(
			this.client,
			this,
			data.standings
		);
		this.finishTime = APIDateToObject(data.createdDate);
		this.seasonId = data.seasonId;
		this.weekNumber = data.sectionIndex + 1;
	}

	/**
	 * The clan this race is for, if cached
	 */
	get clan(): Clan | ClanPreview | ClanResultPreview | null {
		return this.client.allClans.get(this.clanTag) ?? null;
	}

	/**
	 * Clone this race.
	 */
	clone(): FinishedRiverRace {
		return new FinishedRiverRace(this.client, this.toJSON(), this.clanTag);
	}

	/**
	 * Check whether this race is equal to another race.
	 * @param race - The race to compare to
	 * @returns Whether the races are equal
	 */
	equals(race: FinishedRiverRace): race is this {
		return (
			super.equals(race) &&
			this.finishTime.getTime() === race.finishTime.getTime() &&
			this.leaderboard.equals(race.leaderboard) &&
			this.seasonId === race.seasonId &&
			this.weekNumber === race.weekNumber
		);
	}

	/**
	 * Patch this race.
	 * @returns The patched race
	 */
	patch(data: Partial<T>): this {
		if (data.seasonId != null) this.seasonId = data.seasonId;
		if (data.sectionIndex != null) this.weekNumber = data.sectionIndex + 1;
		if (data.createdDate != null)
			this.finishTime = APIDateToObject(data.createdDate);
		if (data.standings != null)
			this.leaderboard.overrideItems(...data.standings);

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this race.
	 * @returns The JSON representation of this race
	 */
	toJSON(): APIRiverRaceLogEntry {
		return {
			...super.toJSON(),
			createdDate: dateObjectToAPIDate(this.finishTime),
			seasonId: this.seasonId,
			sectionIndex: this.weekNumber - 1,
			standings: this.leaderboard.toJSON(),
		};
	}
}

export default FinishedRiverRace;
