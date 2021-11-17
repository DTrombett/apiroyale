import type { APIRiverRaceLogEntry, ClientRoyale } from "..";
import Structure from "./Structure";
import { RiverRaceStandingManager } from "../managers";
import { APIDateToObject, dateObjectToAPIDate } from "../util";

/**
 * Represents a river race
 */
export class RiverRace extends Structure<APIRiverRaceLogEntry> {
	static id = "seasonId";

	/**
	 * The season id of this race
	 */
	seasonId: number;

	/**
	 * When this race has ended
	 */
	finishTime: Date;

	/**
	 * A leaderboard of clans in this race
	 */
	leaderboard: RiverRaceStandingManager;

	/**
	 * The number of the week of this race
	 */
	weekNumber: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data of the river race
	 */
	constructor(client: ClientRoyale, data: APIRiverRaceLogEntry) {
		super(client, data);

		this.seasonId = data.seasonId;
		this.weekNumber = data.sectionIndex + 1;
		this.finishTime = APIDateToObject(data.createdDate);
		this.leaderboard = new RiverRaceStandingManager(
			this.client,
			data.standings
		);
	}

	/**
	 * Clone this race.
	 */
	clone() {
		return new RiverRace(this.client, this.toJson());
	}

	/**
	 * Checks whether this race is equal to another race, comparing all properties.
	 * @param other - The race to compare to
	 * @returns Whether the races are equal
	 */
	equals(other: RiverRace): boolean {
		return (
			super.equals(other) &&
			this.seasonId === other.seasonId &&
			this.weekNumber === other.weekNumber &&
			this.finishTime.getTime() === other.finishTime.getTime() &&
			this.leaderboard
				.mapValues((standing) => standing.rank)
				.equals(other.leaderboard.mapValues((standing) => standing.rank))
		);
	}

	/**
	 * Checks whether this race is the last of the month and is played in the arena
	 */
	isArena(): boolean {
		return this.weekNumber === 4;
	}

	/**
	 * Patch this race.
	 * @returns The patched race
	 */
	patch(data: Partial<APIRiverRaceLogEntry>) {
		const old = this.clone();
		super.patch(data);

		if (data.seasonId != null) this.seasonId = data.seasonId;
		if (data.sectionIndex != null) this.weekNumber = data.sectionIndex + 1;
		if (data.createdDate != null)
			this.finishTime = APIDateToObject(data.createdDate);
		if (data.standings != null) {
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
	toJson<T extends APIRiverRaceLogEntry = APIRiverRaceLogEntry>(): T;
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
	 * Gets a string representation of this location.
	 * @returns The name of this location
	 */
	toString() {
		return this.isArena() ? "Arena della guerra tra clan" : `Gara sul fiume`;
	}
}

export default RiverRace;
