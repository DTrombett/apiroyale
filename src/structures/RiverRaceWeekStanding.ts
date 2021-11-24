import type ClientRoyale from "..";
import type { APIRiverRaceWeekStanding, Clan, FinishedRiverRace } from "..";
import { RiverRaceParticipantManager } from "../managers";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import Structure from "./Structure";

/**
 * A river race standing
 */
export class RiverRaceWeekStanding extends Structure<APIRiverRaceWeekStanding> {
	static id = "rank" as const;

	/**
	 * The rank of the clan in this race
	 */
	rank: number;

	/**
	 * The number of war trophy the clan wins/loses with this standing
	 */
	trophyChange: number;

	/**
	 * The clan war trophies BEFORE this war ends
	 */
	clanScore: number;

	/**
	 * Points accumuled by the clan in this race until now
	 */
	points: number;

	/**
	 * When the clan completed the race
	 * * Note: This is always null if the war is fought in the arena
	 */
	finishedAt: Date | null;

	/**
	 * Members that have participated in this race
	 */
	participants: RiverRaceParticipantManager;

	/**
	 * The clan of this standing
	 */
	clan: Clan;

	/**
	 * The number of medals this clan has accumulated in the current day
	 */
	medals: number;

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
		const finishedAt = APIDateToObject(data.clan.finishTime);

		this.race = race;
		this.clan = this.client.clans.add<Clan>(data.clan);
		this.rank = data.rank;
		this.trophyChange = data.trophyChange;
		this.clanScore = data.clan.clanScore;
		this.medals = data.clan.periodPoints;
		this.points = data.clan.fame;
		this.finishedAt = finishedAt.getTime() <= 0 ? null : finishedAt;
		this.participants = new RiverRaceParticipantManager(
			this.client,
			this,
			data.clan.participants
		);
	}

	/**
	 * The number of points this clan is missing to reach the next clan, or null if the clan is the first
	 */
	get pointsToOvertake() {
		const other = this.race.leaderboard.get((this.rank - 1).toString())?.points;

		return other != null ? other - this.points : null;
	}

	/**
	 * The number of medals this clan is missing to reach the next clan, or null if the clan is the first
	 */
	get medalsToOvertake() {
		const other = this.race.leaderboard.get((this.rank - 1).toString())?.medals;

		return other != null ? other - this.medals : null;
	}

	/**
	 * Clone this standing.
	 */
	clone<T extends RiverRaceWeekStanding>(): T;
	clone(): RiverRaceWeekStanding {
		return new RiverRaceWeekStanding(this.client, this.toJson(), this.race);
	}

	/**
	 * Checks whether this standing is equal to another, comparing all properties.
	 * @param standing - The standing to compare to
	 */
	equals(standing: RiverRaceWeekStanding): boolean {
		return (
			this.rank === standing.rank &&
			this.trophyChange === standing.trophyChange &&
			this.clanScore === standing.clanScore &&
			this.medals === standing.medals &&
			this.points === standing.points &&
			this.finishedAt?.getTime() === standing.finishedAt?.getTime() &&
			this.participants
				.mapValues((p) => p.toJson())
				.equals(standing.participants.mapValues((p) => p.toJson())) &&
			this.clan.tag === standing.clan.tag
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

		if (data.rank != null) this.rank = data.rank;
		if (data.trophyChange != null) this.trophyChange = data.trophyChange;
		if (data.clan?.clanScore != null) this.clanScore = data.clan.clanScore;
		if (data.clan?.periodPoints != null) this.medals = data.clan.periodPoints;
		if (data.clan?.fame != null) this.points = data.clan.fame;
		if (data.clan?.finishTime != null) {
			const finishedAt = APIDateToObject(data.clan.finishTime);
			this.finishedAt = finishedAt.getTime() <= 0 ? null : finishedAt;
		}
		if (data.clan?.participants != null) {
			this.participants.clear();
			for (const participant of data.clan.participants)
				this.participants.add(participant);
		}

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
			clan: {
				...this.clan.toJson(),
				clanScore: this.clanScore,
				fame: this.points,
				finishTime: dateObjectToAPIDate(this.finishedAt),
				participants: this.participants.map((p) => p.toJson()),
				periodPoints: this.medals,
				repairPoints: 0,
			},
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
