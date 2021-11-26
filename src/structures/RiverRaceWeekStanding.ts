import type ClientRoyale from "..";
import type { APIRiverRaceWeekStanding, FinishedRiverRace } from "..";
import ClanWeekStanding from "./ClanWeekStanding";
import Structure from "./Structure";

/**
 * A river race standing
 */
export class RiverRaceWeekStanding extends Structure<APIRiverRaceWeekStanding> {
	static id = "rank" as const;

	/**
	 * The rank of the clan in this race
	 */
	rank!: number;

	/**
	 * The number of war trophy the clan wins/loses with this standing
	 */
	trophyChange!: number;

	/**
	 * The clan data for this standing
	 */
	clan: ClanWeekStanding;

	/**
	 * The race this standing is for
	 */
	readonly race: FinishedRiverRace;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data for this standing
	 * @param race - The race of this standing
	 */
	constructor(
		client: ClientRoyale,
		data: APIRiverRaceWeekStanding,
		race: FinishedRiverRace
	) {
		super(client, data);

		this.race = race;
		this.clan = new ClanWeekStanding(this.client, data.clan, this);

		this.patch({
			...data,
			clan: undefined,
		});
	}

	/**
	 * The number of points this clan is missing to reach the next clan, or null if the clan is the first
	 */
	get pointsToOvertake() {
		const other = this.race.leaderboard.get((this.rank - 1).toString())?.clan
			.points;

		return other != null ? other - this.clan.points : null;
	}

	/**
	 * The number of medals this clan is missing to reach the next clan, or null if the clan is the first
	 */
	get medalsToOvertake() {
		const other = this.race.leaderboard.get((this.rank - 1).toString())?.clan
			.medals;

		return other != null ? other - this.clan.medals : null;
	}

	/**
	 * Clone this standing.
	 */
	clone(): RiverRaceWeekStanding {
		return new RiverRaceWeekStanding(this.client, this.toJson(), this.race);
	}

	/**
	 * Checks whether this standing is equal to another, comparing all properties.
	 * @param standing - The standing to compare to
	 */
	equals(standing: RiverRaceWeekStanding): boolean {
		return (
			this.clan.tag === standing.clan.tag &&
			this.rank === standing.rank &&
			this.trophyChange === standing.trophyChange &&
			this.race.seasonId === standing.race.seasonId
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch
	 * @returns The patched standing
	 */
	patch(data: Partial<APIRiverRaceWeekStanding>): this {
		const old = this.clone();
		super.patch(data);

		if (data.rank !== undefined) this.rank = data.rank;
		if (data.trophyChange !== undefined) this.trophyChange = data.trophyChange;
		if (data.clan !== undefined) this.clan.patch(data.clan);

		if (!this.equals(old))
			this.client.emit("riverRaceStandingUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this standing.
	 */
	toJson<R extends APIRiverRaceWeekStanding = APIRiverRaceWeekStanding>(): R;
	toJson(): APIRiverRaceWeekStanding {
		return {
			rank: this.rank,
			trophyChange: this.trophyChange,
			clan: this.clan.toJson(),
		};
	}

	/**
	 * Gets a string representation of this standing.
	 */
	toString(): string {
		return `${this.rank}. ${this.clan.name}`;
	}
}

export default RiverRaceWeekStanding;
