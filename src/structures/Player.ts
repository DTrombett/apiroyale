import type ClientRoyale from "..";
import type {
	APIMember,
	APIPlayer,
	APIRiverRaceLogParticipant,
	APIRole,
	APITag,
	Arena,
	Clan,
} from "..";
import type { NonNullableProperties } from "../util";
import { APIDateToObject, dateObjectToAPIDate, ClanMemberRole } from "../util";
import Structure from "./Structure";

export type PlayerConstructor =
	| APIMember
	| APIPlayer
	| APIRiverRaceLogParticipant;

export type ClanMember<T extends Player = Player> = NonNullableProperties<
	T,
	| "arena"
	| "clanRank"
	| "donationsPerWeek"
	| "donationsReceived"
	| "expLevel"
	| "lastSeen"
	| "name"
	| "previousClanRank"
	| "role"
	| "trophies"
>;

/**
 * A class representing a player
 */
export class Player extends Structure<PlayerConstructor> {
	/**
	 * The arena this player is currently in
	 */
	arena?: Arena;

	/**
	 * The clan of this player
	 */
	clan?: Clan;

	/**
	 * The number of donations this player has made
	 */
	donationsPerWeek?: number;

	/**
	 * The number of donations this player has received
	 */
	donationsReceived?: number;

	/**
	 * The experience level of this player
	 */
	expLevel?: number;

	/**
	 * The last time this player was online
	 */
	lastSeen?: Date;

	/**
	 * The name of this player
	 */
	name: string;

	/**
	 * The previous rank in the clan of this player
	 */
	previousClanRank?: number;

	/**
	 * The rank of this player in the clan
	 */
	clanRank?: number;

	/**
	 * The role of this player
	 */
	role?: ClanMemberRole;

	/**
	 * The tag of this player
	 */
	readonly tag: APITag;

	/**
	 * The number of trophies this player has
	 */
	trophies?: number;

	/**
	 * The best number of trophies this player has ever achieved
	 * TODO: If the player is in record
	 */
	bestTrophies?: number;

	/**
	 * The number of matches this player has won
	 * TODO: Percentual of wins
	 */
	wins?: number;

	/**
	 * The number of matches this player has lost
	 */
	losses?: number;

	/**
	 * The number of battle this player has participated in
	 * TODO: The number of draws
	 */
	battleCount?: number;

	/**
	 * The number of three crown wins this player has
	 * TODO: The percentual of three crown wins
	 */
	threeCrownWins?: number;

	/**
	 * The number of cards won in challenges
	 */
	cardsWonInChallenges?: number;

	/**
	 * The maximum number of wins in a challenge this player has
	 */
	maxWinsInChallenge?: number;

	/**
	 * The number of matches this player has played in tournaments
	 */
	tournamentBattleCount?: number;

	/**
	 * The total number of donations this player has made
	 */
	donations?: number;

	/**
	 * @param client - The client that instantiated this clan player
	 * @param data - The data of the player
	 * @param clan - The clan of the player
	 */
	constructor(client: ClientRoyale, data: PlayerConstructor, clan?: Clan) {
		super(client, data);

		this.tag = data.tag;
		this.name = data.name;
		if (clan) this.clan = clan;

		if ("lastSeen" in data) {
			this.role = ClanMemberRole[data.role];
			this.lastSeen = APIDateToObject(data.lastSeen);
			this.expLevel = data.expLevel;
			this.trophies = data.trophies;
			this.donationsPerWeek = data.donations;
			this.donationsReceived = data.donationsReceived;
			this.arena = client.arenas.add(data.arena);
			this.previousClanRank = data.previousClanRank;
			this.clanRank = data.clanRank;
		}
		if ("leagueStatistics" in data) {
			this.expLevel = data.expLevel;
			this.trophies = data.trophies;
			this.bestTrophies = data.bestTrophies;
			this.clan = client.clans.add(data.clan);
			this.wins = data.wins;
			this.losses = data.losses;
			this.battleCount = data.battleCount;
			this.threeCrownWins = data.threeCrownWins;
			this.cardsWonInChallenges = data.challengeCardsWon;
			this.maxWinsInChallenge = data.challengeMaxWins;
			this.tournamentBattleCount = data.tournamentBattleCount;
			this.role = ClanMemberRole[data.role];
			this.donationsPerWeek = data.donations;
			this.donationsReceived = data.donationsReceived;
			this.donations = data.totalDonations;
			// TODO: Add the rest of the data and other constructors
		}
	}

	/**
	 * The difference between the old and the new rank of this player
	 */
	get rankDifference(): number {
		return this.clanRank - this.previousClanRank;
	}

	/**
	 * The contribution to the total donations of this player, or null if there's no data for clan donations
	 */
	get donationPercentage(): number | null {
		return this.clan.donationsPerWeek !== undefined
			? (this.donationsPerWeek / this.clan.donationsPerWeek) * 100
			: null;
	}

	/**
	 * Clone this player.
	 */
	clone(): Player {
		return new Player(this.client, this.toJson(), this.clan);
	}

	/**
	 * Checks whether this player is equal to another player, comparing all properties.
	 * @param player - The player to compare to
	 * @returns Whether the players are equal
	 */
	equals(player: Player): boolean {
		return (
			super.equals(player) &&
			this.arena.equals(player.arena) &&
			this.donationsPerWeek === player.donationsPerWeek &&
			this.donationsReceived === player.donationsReceived &&
			this.expLevel === player.expLevel &&
			this.lastSeen.getTime() === player.lastSeen.getTime() &&
			this.name === player.name &&
			this.previousClanRank === player.previousClanRank &&
			this.clanRank === player.clanRank &&
			this.role === player.role &&
			this.trophies === player.trophies
		);
	}

	/**
	 * Checks if this object has all properties of a member.
	 */
	isMember(): this is ClanMember<this> {
		return this.lastSeen !== undefined;
	}

	/**
	 * Patches this player.
	 * @param data - The data to update this player with
	 * @returns The updated player
	 */
	patch(data: APIMember): NonNullableProperties<this, keyof this>;
	patch(data: Partial<APIMember>): this;
	patch(data: Partial<APIMember>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.role !== undefined) this.role = ClanMemberRole[data.role];
		if (data.clanRank !== undefined) this.clanRank = data.clanRank;
		if (data.previousClanRank !== undefined)
			this.previousClanRank = data.previousClanRank;
		if (data.donations !== undefined) this.donationsPerWeek = data.donations;
		if (data.donationsReceived !== undefined)
			this.donationsReceived = data.donationsReceived;
		if (data.expLevel !== undefined) this.expLevel = data.expLevel;
		if (data.lastSeen !== undefined)
			this.lastSeen = APIDateToObject(data.lastSeen);
		if (data.trophies !== undefined) this.trophies = data.trophies;
		if (data.arena !== undefined)
			this.arena = this.client.arenas.add(data.arena);

		if (!this.equals(old)) this.client.emit("playerUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this player.
	 */
	toJson(): APIMember {
		return {
			...super.toJson(),
			arena: this.arena.toJson(),
			clanRank: this.clanRank,
			donations: this.donationsPerWeek,
			donationsReceived: this.donationsReceived,
			expLevel: this.expLevel,
			lastSeen: dateObjectToAPIDate(this.lastSeen),
			name: this.name,
			previousClanRank: this.previousClanRank,
			role: ClanMemberRole[this.role] as APIRole,
			tag: this.tag,
			trophies: this.trophies,
		};
	}

	/**
	 * Gets the string representation of this player.
	 * @returns The name of this player
	 */
	toString(): string {
		return this.name;
	}
}

export default Player;
