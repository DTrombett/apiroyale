import type ClientRoyale from "..";
import type {
	APIRiverRacePeriodStanding,
	APITag,
	Clan,
	RiverRacePeriod,
} from "..";
import Structure from "./Structure";

/**
 * A river race period standing
 */
export class RiverRacePeriodStanding extends Structure<APIRiverRacePeriodStanding> {
	/**
	 * The clan tag for this standing
	 */
	readonly clanTag: APITag;

	/**
	 * The defenses remaining for the clan in this period
	 */
	defensesRemaining!: number;

	declare readonly id: APITag;

	/**
	 * The medal count of the clan in this period
	 */
	medals: number;

	/**
	 * The progress before this period
	 */
	oldProgress: number;

	/**
	 * The period of this standing
	 */
	readonly period: RiverRacePeriod;

	/**
	 * The points earned in this period
	 */
	pointsEarned: number;

	/**
	 * The points earned from defenses in this period
	 */
	pointsEarnedFromDefenses: number;

	/**
	 * The rank of the clan in this period
	 */
	rank: number;

	/**
	 * The total progress after this period
	 */
	totalProgress: number;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data for this standing
	 * @param period - The race of this standing
	 */
	constructor(
		client: ClientRoyale,
		data: APIRiverRacePeriodStanding,
		period: RiverRacePeriod
	) {
		super(client, data, data.clan.tag);

		this.period = period;
		this.clanTag = data.clan.tag;
		this.defensesRemaining = data.numOfDefensesRemaining;
		this.medals = data.pointsEarned;
		this.oldProgress = data.progressStartOfDay;
		this.pointsEarned = data.progressEarned;
		this.pointsEarnedFromDefenses = data.progressEarnedFromDefenses;
		this.rank = data.endOfDayRank + 1;
		this.totalProgress = data.progressEndOfDay;
	}

	/**
	 * The clan of this standing
	 */
	get clan(): Clan | null {
		return this.client.clans.get(this.clanTag) ?? null;
	}

	/**
	 * The total progress the clan has earned in this period
	 */
	get totalProgressEarned(): number {
		return this.pointsEarned + this.pointsEarnedFromDefenses;
	}

	/**
	 * Clone this standing.
	 */
	clone(): RiverRacePeriodStanding {
		return new RiverRacePeriodStanding(this.client, this.toJSON(), this.period);
	}

	/**
	 * Check whether this standing is equal to another.
	 * @param standing - The standing to compare to
	 */
	equals(standing: RiverRacePeriodStanding): standing is this {
		return (
			super.equals(standing) &&
			this.clanTag === standing.clanTag &&
			this.defensesRemaining === standing.defensesRemaining &&
			this.medals === standing.medals &&
			this.oldProgress === standing.oldProgress &&
			this.period.id === standing.period.id &&
			this.pointsEarned === standing.pointsEarned &&
			this.pointsEarnedFromDefenses === standing.pointsEarnedFromDefenses &&
			this.rank === standing.rank &&
			this.totalProgress === standing.totalProgress
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch this standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<APIRiverRacePeriodStanding>): this {
		if (data.endOfDayRank !== undefined) this.rank = data.endOfDayRank + 1;
		if (data.numOfDefensesRemaining !== undefined)
			this.defensesRemaining = data.numOfDefensesRemaining;
		if (data.pointsEarned !== undefined) this.medals = data.pointsEarned;
		if (data.progressEarned !== undefined)
			this.pointsEarned = data.progressEarned;
		if (data.progressEarnedFromDefenses !== undefined)
			this.pointsEarnedFromDefenses = data.progressEarnedFromDefenses;
		if (data.progressEndOfDay !== undefined)
			this.totalProgress = data.progressEndOfDay;
		if (data.progressStartOfDay !== undefined)
			this.oldProgress = data.progressStartOfDay;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this standing.
	 * @returns The JSON representation of this standing
	 */
	toJSON(): APIRiverRacePeriodStanding {
		return {
			...super.toJSON(),
			clan: {
				tag: this.clanTag,
			},
			endOfDayRank: this.rank - 1,
			numOfDefensesRemaining: this.defensesRemaining,
			pointsEarned: this.medals,
			progressEarned: this.pointsEarned,
			progressEarnedFromDefenses: this.pointsEarnedFromDefenses,
			progressEndOfDay: this.totalProgress,
			progressStartOfDay: this.oldProgress,
		};
	}
}

export default RiverRacePeriodStanding;
