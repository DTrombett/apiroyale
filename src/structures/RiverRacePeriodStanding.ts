import type { Clan } from ".";
import type ClientRoyale from "..";
import type { APIRiverRacePeriodStanding, APITag } from "..";
import type RiverRacePeriod from "./RiverRacePeriod";
import Structure from "./Structure";

/**
 * A river race standing
 */
export class RiverRacePeriodStanding extends Structure<APIRiverRacePeriodStanding> {
	static id = "progressEarnedFromDefenses" as const;

	/**
	 * The rank of the clan in this race
	 */
	rank!: number;

	/**
	 * The clan tag for this standing
	 */
	clanTag: APITag;

	/**
	 * The race this standing is for
	 */
	readonly period: RiverRacePeriod;

	/**
	 * The defenses remaining for the clan in this standing
	 */
	defensesRemaining!: number;

	/**
	 * The medal count for the clan in this standing
	 */
	medals!: number;

	/**
	 * The points earned for this standing
	 */
	pointsEarned!: number;

	/**
	 * The points earned from defenses for this standing
	 */
	pointsEarnedFromDefenses!: number;

	/**
	 * The total progress after this period
	 */
	totalProgress!: number;

	/**
	 * The progress before this period
	 */
	oldProgress!: number;

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
		super(client, data);

		this.period = period;
		this.clanTag = data.clan.tag;

		this.patch({
			...data,
			clan: undefined,
		});
	}

	/**
	 * The clan of this standing, if cached
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
		return new RiverRacePeriodStanding(this.client, this.toJson(), this.period);
	}

	/**
	 * Checks whether this standing is equal to another, comparing all properties.
	 * @param standing - The standing to compare to
	 */
	equals(standing: RiverRacePeriodStanding): boolean {
		return (
			super.equals(standing) &&
			this.period.id === standing.period.id &&
			this.rank === standing.rank &&
			this.defensesRemaining === standing.defensesRemaining &&
			this.medals === standing.medals &&
			this.pointsEarned === standing.pointsEarned &&
			this.pointsEarnedFromDefenses === standing.pointsEarnedFromDefenses &&
			this.totalProgress === standing.totalProgress &&
			this.oldProgress === standing.oldProgress
		);
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch
	 * @returns The patched standing
	 */
	patch(data: Partial<APIRiverRacePeriodStanding>): this {
		const old = this.clone();
		super.patch(data);

		if (data.endOfDayRank !== undefined) this.rank = data.endOfDayRank;
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

		if (!this.equals(old))
			this.client.emit("riverRacePeriodStandingUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this standing.
	 */
	toJson(): APIRiverRacePeriodStanding {
		return {
			...super.toJson(),
			clan: {
				tag: this.clanTag,
			},
			endOfDayRank: this.rank,
			numOfDefensesRemaining: this.defensesRemaining,
			pointsEarned: this.medals,
			progressEarned: this.pointsEarned,
			progressEarnedFromDefenses: this.pointsEarnedFromDefenses,
			progressEndOfDay: this.totalProgress,
			progressStartOfDay: this.oldProgress,
		};
	}

	/**
	 * Gets a string representation of this standing.
	 */
	toString(): string {
		return `${this.rank}`;
	}
}

export default RiverRacePeriodStanding;
