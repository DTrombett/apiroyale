import type ClientRoyale from "..";
import type { APIRiverRaceWeekStanding, APITag, FinishedRiverRace } from "..";
import ClanWeekStanding from "./ClanWeekStanding";
import Structure from "./Structure";

/**
 * A river race week standing
 */
export class RiverRaceWeekStanding extends Structure<APIRiverRaceWeekStanding> {
	/**
	 * The clan data for this standing
	 */
	readonly clan: ClanWeekStanding;

	readonly id!: APITag;

	/**
	 * The race this standing is for
	 */
	readonly race: FinishedRiverRace;

	/**
	 * The rank of the clan in this race
	 */
	rank!: number;

	/**
	 * The number of war trophies the clan wins/loses with this standing
	 */
	trophyChange!: number;

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
		super(client, data, data.clan.tag);
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
	get pointsToOvertake(): number | null {
		const other = this.race.leaderboard.find(
			(standing) => standing.rank === this.rank - 1
		)?.clan.points;

		return other != null ? other - this.clan.points : null;
	}

	/**
	 * The number of medals this clan is missing to reach the next clan, or null if the clan is the first
	 */
	get medalsToOvertake(): number | null {
		const other = this.race.leaderboard.find(
			(standing) => standing.rank === this.rank - 1
		)?.clan.medals;

		return other != null ? other - this.clan.medals : null;
	}

	/**
	 * Clone this standing.
	 * @returns The cloned standing
	 */
	clone(): RiverRaceWeekStanding {
		return new RiverRaceWeekStanding(this.client, this.toJson(), this.race);
	}

	/**
	 * Check whether this standing is equal to another.
	 * @param standing - The standing to compare to
	 * @returns Whether the standings are equal
	 */
	equals(standing: RiverRaceWeekStanding): standing is this {
		return (
			this.clan.id === standing.clan.id &&
			this.race.id === standing.race.id &&
			this.rank === standing.rank &&
			this.trophyChange === standing.trophyChange
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch this standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<APIRiverRaceWeekStanding>): this {
		if (data.clan !== undefined) this.clan.patch(data.clan);
		if (data.rank !== undefined) this.rank = data.rank;
		if (data.trophyChange !== undefined) this.trophyChange = data.trophyChange;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this standing.
	 * @returns The JSON representation of this standing
	 */
	toJson(): APIRiverRaceWeekStanding {
		return {
			...super.toJson(),
			rank: this.rank,
			trophyChange: this.trophyChange,
			clan: this.clan.toJson(),
		};
	}
}

export default RiverRaceWeekStanding;
