import type ClientRoyale from "..";
import type { APIRiverRaceStanding, Clan, RiverRace } from "..";
import { RiverRaceParticipantManager } from "../managers";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import Structure from "./Structure";

/**
 * A river race standing
 */
export class RiverRaceStanding extends Structure<APIRiverRaceStanding> {
	static id = "rank";

	/**
	 * The rank of the clan in this race
	 */
	rank: number;

	/**
	 * The number of war trophy the clan wins/loses with this standing
	 */
	trophyChange: number;

	/**
	 * The clan war trophies before this war ends
	 */
	oldClanScore: number;

	/**
	 * Points accumuled by the clan in this race
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
	 * The race this standing is for
	 */
	readonly race: RiverRace;

	/**
	 * @param client - The client that instantiated this
	 * @param data - The data for this standing
	 * @param race - The race of this standing
	 */
	constructor(
		client: ClientRoyale,
		data: APIRiverRaceStanding,
		race: RiverRace
	) {
		super(client, data);
		const finishedAt = APIDateToObject(data.clan.finishTime);

		this.race = race;
		this.clan = this.client.clans.add<Clan>(data.clan);
		this.rank = data.rank;
		this.trophyChange = data.trophyChange;
		this.oldClanScore = data.clan.clanScore;
		this.points = data.clan.fame;
		this.finishedAt = finishedAt.getTime() <= 0 ? null : finishedAt;
		this.participants = new RiverRaceParticipantManager(
			this.client,
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
	 * Clone this standing.
	 */
	clone<T extends RiverRaceStanding>(): T;
	clone(): RiverRaceStanding {
		return new RiverRaceStanding(this.client, this.toJson(), this.race);
	}

	/**
	 * Checks whether this standing is equal to another, comparing all properties.
	 * @param standing - The standing to compare to
	 */
	equals(standing: RiverRaceStanding): boolean {
		return (
			this.rank === standing.rank &&
			this.trophyChange === standing.trophyChange &&
			this.oldClanScore === standing.oldClanScore &&
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
	patch(data: Partial<APIRiverRaceStanding>): this {
		const old = this.clone();
		super.patch(data);

		if (data.rank != null) this.rank = data.rank;
		if (data.trophyChange != null) this.trophyChange = data.trophyChange;
		if (data.clan?.clanScore != null) this.oldClanScore = data.clan.clanScore;
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
	toJson<R extends APIRiverRaceStanding = APIRiverRaceStanding>(): R;
	toJson(): APIRiverRaceStanding {
		return {
			rank: this.rank,
			trophyChange: this.trophyChange,
			clan: {
				clanScore: this.oldClanScore,
				fame: this.points,
				finishTime: dateObjectToAPIDate(this.finishedAt),
				participants: this.participants.map((p) => p.toJson()),
				periodPoints: 0,
				repairPoints: 0,
				...this.clan.toJson(),
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

export default RiverRaceStanding;
