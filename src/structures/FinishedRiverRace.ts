import type { APIRiverRaceLogEntry, ClientRoyale, StringId } from "..";
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
	 * When this race has ended
	 */
	finishTime!: Date;

	readonly id!: StringId;

	/**
	 * A leaderboard of clans in this race
	 */
	readonly leaderboard: RiverRaceWeekStandingManager;

	/**
	 * The season id of this race
	 */
	seasonId!: number;

	/**
	 * The number of the week of this race
	 */
	weekNumber!: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data of the river race
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.seasonId}`);
		this.leaderboard = new RiverRaceWeekStandingManager(
			this.client,
			this,
			data.standings
		);
		this.patch(data);
	}

	/**
	 * Clone this race.
	 */
	clone(): FinishedRiverRace {
		return new FinishedRiverRace(this.client, this.toJson());
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
		if (data.standings != null) this.leaderboard.overrideItems(data.standings);

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this race.
	 * @returns The JSON representation of this race
	 */
	toJson(): APIRiverRaceLogEntry {
		return {
			...super.toJson(),
			createdDate: dateObjectToAPIDate(this.finishTime),
			seasonId: this.seasonId,
			sectionIndex: this.weekNumber - 1,
			standings: this.leaderboard.toJson(),
		};
	}
}

export default FinishedRiverRace;
