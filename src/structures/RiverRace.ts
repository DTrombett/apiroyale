import type {
	APIRiverRaceLogEntry,
	APIRiverRaceLogStanding,
	ClientRoyale,
} from "..";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import UnpatchableStructure from "./UnpatchableStructure";

/**
 * Represents a river race
 */
export class RiverRace extends UnpatchableStructure<APIRiverRaceLogEntry> {
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
	 * TODO: Create a manager and a class for this
	 */
	ranking: APIRiverRaceLogStanding[];

	/**
	 * The number of the week of this race
	 */
	weekNumber: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data of the river race
	 */
	constructor(client: ClientRoyale, data: APIRiverRaceLogEntry) {
		super(client);

		this.seasonId = data.seasonId;
		this.weekNumber = data.sectionIndex + 1;
		this.finishTime = APIDateToObject(data.createdDate);
		this.ranking = data.standings;
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
			this.finishTime.getTime() === other.finishTime.getTime()
			// TODO: Compare ranking
		);
	}

	/**
	 * Checks whether this race is the last of the month and is played in the arena
	 */
	isArena(): boolean {
		return this.weekNumber === 4;
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
			// TODO: ranking
			standings: this.ranking,
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
