import type { APIRiverRaceLogEntry, ClientRoyale } from "..";
import Structure from "./Structure";
import { RiverRaceStandingManager } from "../managers";
import { APIDateToObject, dateObjectToAPIDate } from "../util";

/**
 * A finished river race
 */
export class FinishedRiverRace<
	T extends APIRiverRaceLogEntry = APIRiverRaceLogEntry
> extends Structure<T> {
	static id = "seasonId" as const;

	/**
	 * When this race has ended
	 */
	finishTime!: Date;

	/**
	 * A leaderboard of clans in this race
	 */
	leaderboard: RiverRaceStandingManager;

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
		super(client, data);
		this.leaderboard = new RiverRaceStandingManager(
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
	 * Checks whether this race is equal to another race, comparing all properties.
	 * @param other - The race to compare to
	 * @returns Whether the races are equal
	 */
	equals(other: FinishedRiverRace): boolean {
		return (
			super.equals(other) &&
			this.seasonId === other.seasonId &&
			this.weekNumber === other.weekNumber &&
			this.finishTime.getTime() === other.finishTime.getTime() &&
			this.leaderboard
				.mapValues((standing) => standing.clan.tag)
				.equals(other.leaderboard.mapValues((standing) => standing.clan.tag))
		);
	}

	/**
	 * Patch this race.
	 * @returns The patched race
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.seasonId != null) this.seasonId = data.seasonId;
		if (data.sectionIndex != null) this.weekNumber = data.sectionIndex + 1;
		if (data.createdDate != null)
			this.finishTime = APIDateToObject(data.createdDate);
		if (data.standings != null) {
			// TODO: This is a bit of a hack, but it works for now
			this.leaderboard.clear();
			for (const standing of data.standings) this.leaderboard.add(standing);
		}

		if (!this.equals(old)) this.client.emit("riverRaceUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this race.
	 * @returns The JSON representation of this race
	 */
	toJson(): APIRiverRaceLogEntry {
		return {
			...super.toJson(),
			createdDate: dateObjectToAPIDate(this.finishTime),
			seasonId: this.seasonId,
			sectionIndex: this.weekNumber - 1,
			standings: this.leaderboard.map((standing) => standing.toJson()),
		};
	}

	/**
	 * Gets a string representation of this race.
	 * @returns The week day of this race
	 */
	toString() {
		return `Week ${this.weekNumber}`;
	}
}

export default FinishedRiverRace;
