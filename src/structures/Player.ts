import type { PlayerCard } from ".";
import type ClientRoyale from "..";
import type {
	APILeagueStatistics,
	APIMember,
	APIPlayer,
	APIRiverRaceParticipant,
	APIRole,
	APITag,
	Arena,
	Clan,
} from "..";
import {
	PlayerAchievementManager,
	PlayerBadgeManager,
	PlayerCardManager,
} from "../managers";
import type { FetchOptions, NonNullableProperties, Path } from "../util";
import { APIDateToObject, ClanMemberRole, dateObjectToAPIDate } from "../util";
import FetchableStructure from "./FetchableStructure";

export type PlayerConstructor =
	| APIMember
	| APIPlayer
	| Pick<APIRiverRaceParticipant, "decksUsedToday" | "name" | "tag">;

export type ClanMember<T extends Player = Player> = NonNullableProperties<
	T,
	| "arena"
	| "clanRank"
	| "donationsPerWeek"
	| "donationsReceived"
	| "expLevel"
	| "lastSeen"
	| "previousClanRank"
	| "role"
	| "trophies"
>;
export type OnlyPlayer<T extends Player = Player> = NonNullableProperties<
	T,
	| "achievements"
	| "arena"
	| "battleCount"
	| "bestTrophies"
	| "cards"
	| "cardsWonInChallenges"
	| "clan"
	| "deck"
	| "donations"
	| "donationsPerWeek"
	| "donationsReceived"
	| "expLevel"
	| "expPoints"
	| "favouriteCard"
	| "leagueStatistics"
	| "losses"
	| "maxWinsInChallenge"
	| "oldClanCardsCollected"
	| "oldWarDayWins"
	| "role"
	| "starPoints"
	| "threeCrownWins"
	| "tournamentBattleCount"
	| "tournamentCardsWon"
	| "trophies"
	| "wins"
>;
export type RiverRaceParticipantData<T extends Player = Player> =
	NonNullableProperties<T, "warDecksUsedToday">;

/**
 * A class representing a player
 */
export class Player extends FetchableStructure<PlayerConstructor> {
	static route: Path = "/players/:id";

	/**
	 * The arena this player is currently in
	 */
	arena?: Arena;

	/**
	 * The clan of this player
	 */
	clan!: Clan;

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
	 */
	bestTrophies?: number;

	/**
	 * The number of matches this player has won
	 */
	wins?: number;

	/**
	 * The number of matches this player has lost
	 */
	losses?: number;

	/**
	 * The number of battle this player has participated in
	 */
	battleCount?: number;

	/**
	 * The number of three crown wins this player has
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
	 * The number of wins this player had in the old war day
	 */
	oldWarDayWins?: number;

	/**
	 * The number of cards this player had collected in the old war
	 */
	oldClanCardsCollected?: number;

	/**
	 * League statistics of this player
	 */
	leagueStatistics?: APILeagueStatistics;

	/**
	 * The badges of this player
	 */
	badges = new PlayerBadgeManager(this.client);

	/**
	 * The achievements of this player
	 */
	achievements = new PlayerAchievementManager(this.client);

	/**
	 * The cards of this player
	 */
	cards = new PlayerCardManager(this.client);

	/**
	 * The deck of this player
	 */
	deck = new PlayerCardManager(this.client);

	/**
	 * The most used card of this player
	 */
	favouriteCard?: PlayerCard;

	/**
	 * The star points of this player
	 */
	starPoints?: number;

	/**
	 * The exp points of this player
	 */
	expPoints?: number;

	/**
	 * Number of cards won in tournaments
	 */
	tournamentCardsWon?: number;

	/**
	 * Number of decks used in war today
	 */
	warDecksUsedToday?: number;

	/**
	 * @param client - The client that instantiated this clan player
	 * @param data - The data of the player
	 * @param clan - The clan of the player
	 */
	constructor(client: ClientRoyale, data: APIMember, clan: Clan);
	constructor(client: ClientRoyale, data: PlayerConstructor, clan?: Clan);
	constructor(client: ClientRoyale, data: PlayerConstructor, clan?: Clan) {
		super(client, data);

		this.tag = data.tag;
		this.name = data.name;
		if (clan) this.clan = clan;

		if ("lastSeen" in data) {
			this.arena = this.client.arenas.add(data.arena);
			this.clanRank = data.clanRank;
			this.donationsPerWeek = data.donations;
			this.donationsReceived = data.donationsReceived;
			this.expLevel = data.expLevel;
			this.lastSeen = APIDateToObject(data.lastSeen);
			this.previousClanRank = data.previousClanRank;
			this.role = ClanMemberRole[data.role];
			this.trophies = data.trophies;
		}
		if ("leagueStatistics" in data) {
			this.achievements = new PlayerAchievementManager(
				this.client,
				data.achievements
			);
			this.arena = this.client.arenas.add(data.arena);
			this.badges = new PlayerBadgeManager(this.client, data.badges);
			this.battleCount = data.battleCount;
			this.bestTrophies = data.bestTrophies;
			this.cards = new PlayerCardManager(this.client, data.cards);
			this.cardsWonInChallenges = data.challengeCardsWon;
			this.clan = this.client.clans.add(data.clan);
			this.clan = this.client.clans.add(data.clan);
			this.deck = new PlayerCardManager(this.client, data.currentDeck);
			this.donations = data.totalDonations;
			this.donationsPerWeek = data.donations;
			this.donationsReceived = data.donationsReceived;
			this.expLevel = data.expLevel;
			this.expPoints = data.expPoints;
			this.favouriteCard = this.cards.add(data.currentFavouriteCard);
			this.leagueStatistics = data.leagueStatistics;
			this.losses = data.losses;
			this.maxWinsInChallenge = data.challengeMaxWins;
			this.oldClanCardsCollected = data.clanCardsCollected;
			this.oldWarDayWins = data.warDayWins;
			this.role = ClanMemberRole[data.role];
			this.starPoints = data.starPoints;
			this.threeCrownWins = data.threeCrownWins;
			this.tournamentBattleCount = data.tournamentBattleCount;
			this.tournamentCardsWon = data.tournamentCardsWon;
			this.trophies = data.trophies;
			this.wins = data.wins;
		}
		if ("decksUsedToday" in data) this.warDecksUsedToday = data.decksUsedToday;
	}

	/**
	 * The difference between the old and the new rank of this player or null if we don't have enough data
	 */
	get rankDifference(): number | null {
		return this.clanRank != null && this.previousClanRank != null
			? this.clanRank - this.previousClanRank
			: null;
	}

	/**
	 * The contribution to the total donations of this player, or null if there's no data for donations
	 */
	get donationPercentage(): number | null {
		return this.clan.donationsPerWeek != null && this.donationsPerWeek != null
			? (this.donationsPerWeek / this.clan.donationsPerWeek) * 100
			: null;
	}

	/**
	 * If this player's current trophies are the highest they've ever achieved, or null if there's no data
	 */
	get isBestTrophies(): boolean | null {
		return this.trophies != null && this.bestTrophies != null
			? this.trophies >= this.bestTrophies
			: null;
	}

	/**
	 * The percentual of matches won by this player, or null if there's no data
	 */
	get winPercentage(): number | null {
		return this.battleCount != null && this.wins != null
			? (this.wins / this.battleCount) * 100
			: null;
	}

	/**
	 * The number of matches finished with a draw, or null if there's no data
	 */
	get draws(): number | null {
		return this.battleCount != null && this.wins != null && this.losses != null
			? this.battleCount - this.wins - this.losses
			: null;
	}

	/**
	 * The percentual of three crown wins of this player, or null if there's no data
	 */
	get threeCrownWinPercentage(): number | null {
		return this.wins != null && this.threeCrownWins != null
			? (this.threeCrownWins / this.wins) * 100
			: null;
	}

	/**
	 * Clone this player.
	 */
	clone<R extends Player>(): R;
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
			((!this.arena && !player.arena) || this.arena?.id === player.arena?.id) &&
			this.achievements
				.mapValues((a) => a.name)
				.equals(player.achievements.mapValues((a) => a.name)) &&
			this.badges
				.mapValues((b) => b.name)
				.equals(player.badges.mapValues((b) => b.name)) &&
			this.battleCount === player.battleCount &&
			this.bestTrophies === player.bestTrophies &&
			this.cards
				.mapValues((c) => c.id)
				.equals(player.cards.mapValues((c) => c.id)) &&
			this.cardsWonInChallenges === player.cardsWonInChallenges &&
			this.clan.tag === player.clan.tag &&
			this.clanRank === player.clanRank &&
			this.deck
				.mapValues((c) => c.id)
				.equals(player.deck.mapValues((c) => c.id)) &&
			this.donations === player.donations &&
			this.donationsPerWeek === player.donationsPerWeek &&
			this.donationsReceived === player.donationsReceived &&
			this.expLevel === player.expLevel &&
			this.expPoints === player.expPoints &&
			this.favouriteCard?.id === player.favouriteCard?.id &&
			this.lastSeen?.getTime() === player.lastSeen?.getTime() &&
			this.leagueStatistics?.bestSeason.trophies ===
				player.leagueStatistics?.bestSeason.trophies &&
			this.leagueStatistics?.currentSeason.trophies ===
				player.leagueStatistics?.currentSeason.trophies &&
			this.leagueStatistics?.previousSeason.trophies ===
				player.leagueStatistics?.previousSeason.trophies &&
			this.losses === player.losses &&
			this.maxWinsInChallenge === player.maxWinsInChallenge &&
			this.name === player.name &&
			this.oldClanCardsCollected === player.oldClanCardsCollected &&
			this.oldWarDayWins === player.oldWarDayWins &&
			this.previousClanRank === player.previousClanRank &&
			this.role === player.role &&
			this.starPoints === player.starPoints &&
			this.threeCrownWins === player.threeCrownWins &&
			this.tournamentBattleCount === player.tournamentBattleCount &&
			this.tournamentCardsWon === player.tournamentCardsWon &&
			this.trophies === player.trophies &&
			this.wins === player.wins &&
			this.warDecksUsedToday === player.warDecksUsedToday
		);
	}

	/**
	 * Checks if this object has all properties of a member.
	 */
	isMember(): this is ClanMember<this> {
		return this.lastSeen !== undefined;
	}

	/**
	 * Checks if this object has all properties of a player.
	 */
	isPlayer(): this is OnlyPlayer<this> {
		return this.leagueStatistics !== undefined;
	}

	/**
	 * Checks if this object has all properties of a river race participant.
	 */
	isRiverRaceParticipant(): this is RiverRaceParticipantData<this> {
		return this.warDecksUsedToday !== undefined;
	}

	/**
	 * Patches this player.
	 * @param data - The data to update this player with
	 * @returns The updated player
	 */
	patch(data: APIMember): ClanMember<this> & this;
	patch(data: APIPlayer): OnlyPlayer<this> & this;
	patch(data: Partial<PlayerConstructor>): this;
	patch(data: Partial<PlayerConstructor>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name != null) this.name = data.name;

		if ("lastSeen" in data) {
			if (data.arena != null) this.arena = this.client.arenas.add(data.arena);
			if (data.role != null) this.role = ClanMemberRole[data.role];
			if (data.clanRank != null) this.clanRank = data.clanRank;
			if (data.donations != null) this.donationsPerWeek = data.donations;
			if (data.donationsReceived != null)
				this.donationsReceived = data.donationsReceived;
			if (data.expLevel != null) this.expLevel = data.expLevel;
			if (data.lastSeen != null) this.lastSeen = APIDateToObject(data.lastSeen);
			if (data.previousClanRank != null)
				this.previousClanRank = data.previousClanRank;
			if (data.role != null) this.role = ClanMemberRole[data.role];
			if (data.trophies != null) this.trophies = data.trophies;
		}
		if ("leagueStatistics" in data) {
			if (data.role != null) this.role = ClanMemberRole[data.role];
			if (data.arena != null) this.arena = this.client.arenas.add(data.arena);
			if (data.achievements != null) {
				this.achievements.clear();
				for (const achievement of data.achievements)
					this.achievements.add(achievement);
			}
			if (data.badges != null) {
				this.badges.clear();
				for (const badge of data.badges) this.badges.add(badge);
			}
			if (data.battleCount != null) this.battleCount = data.battleCount;
			if (data.bestTrophies != null) this.bestTrophies = data.bestTrophies;
			if (data.cards != null) {
				this.cards.clear();
				for (const card of data.cards) this.cards.add(card);
			}
			if (data.challengeCardsWon != null)
				this.cardsWonInChallenges = data.challengeCardsWon;
			if (data.clan != null) this.clan = this.client.clans.add(data.clan);
			if (data.currentDeck != null) {
				this.deck.clear();
				for (const card of data.currentDeck) this.deck.add(card);
			}
			if (data.totalDonations != null) this.donations = data.totalDonations;
			if (data.donations != null) this.donationsPerWeek = data.donations;
			if (data.donationsReceived != null)
				this.donationsReceived = data.donationsReceived;
			if (data.expLevel != null) this.expLevel = data.expLevel;
			if (data.expPoints != null) this.expPoints = data.expPoints;
			if (data.currentFavouriteCard != null)
				this.favouriteCard = this.cards.add(data.currentFavouriteCard);
			if (data.leagueStatistics != null)
				this.leagueStatistics = data.leagueStatistics;
			if (data.losses != null) this.losses = data.losses;
			if (data.challengeMaxWins != null)
				this.maxWinsInChallenge = data.challengeMaxWins;
			if (data.clanCardsCollected != null)
				this.oldClanCardsCollected = data.clanCardsCollected;
			if (data.warDayWins != null) this.oldWarDayWins = data.warDayWins;
			if (data.starPoints != null) this.starPoints = data.starPoints;
			if (data.threeCrownWins != null)
				this.threeCrownWins = data.threeCrownWins;
			if (data.tournamentBattleCount != null)
				this.tournamentBattleCount = data.tournamentBattleCount;
			if (data.tournamentCardsWon != null)
				this.tournamentCardsWon = data.tournamentCardsWon;
			if (data.trophies != null) this.trophies = data.trophies;
			if (data.wins != null) this.wins = data.wins;
		}
		if ("decksUsedToday" in data)
			if (data.decksUsedToday != null)
				this.warDecksUsedToday = data.decksUsedToday;

		if (!this.equals(old)) this.client.emit("playerUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this player.
	 */
	toJson<R extends PlayerConstructor = PlayerConstructor>(): R;
	toJson(): PlayerConstructor {
		let data: PlayerConstructor;

		if (this.isMember())
			data = {
				name: this.name,
				tag: this.tag,
				arena: this.arena.toJson(),
				clanRank: this.clanRank,
				donations: this.donationsPerWeek,
				donationsReceived: this.donationsReceived,
				expLevel: this.expLevel,
				lastSeen: dateObjectToAPIDate(this.lastSeen),
				previousClanRank: this.previousClanRank,
				role: ClanMemberRole[this.role] as APIRole,
				trophies: this.trophies,
			};
		else if (this.isPlayer())
			data = {
				name: this.name,
				tag: this.tag,
				achievements: this.achievements.map((achievement) =>
					achievement.toJson()
				),
				arena: this.arena.toJson(),
				badges: this.badges.map((badge) => badge.toJson()),
				battleCount: this.battleCount,
				bestTrophies: this.bestTrophies,
				cards: this.cards.map((card) => card.toJson()),
				challengeCardsWon: this.cardsWonInChallenges,
				clan: this.clan.toJson(),
				currentDeck: this.deck.map((card) => card.toJson()),
				currentFavouriteCard: this.favouriteCard.toJson(),
				donations: this.donationsPerWeek,
				donationsReceived: this.donationsReceived,
				expLevel: this.expLevel,
				expPoints: this.expPoints,
				totalDonations: this.donations,
				leagueStatistics: this.leagueStatistics,
				losses: this.losses,
				challengeMaxWins: this.maxWinsInChallenge,
				clanCardsCollected: this.oldClanCardsCollected,
				warDayWins: this.oldWarDayWins,
				role: ClanMemberRole[this.role] as APIRole,
				starPoints: this.starPoints,
				threeCrownWins: this.threeCrownWins,
				tournamentBattleCount: this.tournamentBattleCount,
				tournamentCardsWon: this.tournamentCardsWon,
				trophies: this.trophies,
				wins: this.wins,
			};
		else if (this.isRiverRaceParticipant())
			data = {
				name: this.name,
				tag: this.tag,
				decksUsedToday: this.warDecksUsedToday,
			};
		else throw new Error("Unknown player type");

		return data;
	}

	/**
	 * Gets the string representation of this player.
	 * @returns The name of this player
	 */
	toString(): string {
		return this.name;
	}

	/**
	 * Fetches this player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new player
	 */
	fetch(options?: FetchOptions) {
		return this.client.players.fetch(this.tag, options) as Promise<
			OnlyPlayer<this>
		>;
	}
}

export default Player;
