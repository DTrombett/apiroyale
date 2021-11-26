import type ClientRoyale from "..";
import type {
	APILeagueStatistics,
	APIPlayer,
	APIRole,
	Arena,
	Clan,
	FetchOptions,
	PlayerCard,
	ClanMember,
} from "..";
import {
	PlayerAchievementManager,
	PlayerBadgeManager,
	PlayerCardManager,
} from "../managers";
import { ClanMemberRole, isEqual } from "../util";
import BasePlayer from "./BasePlayer";

/**
 * A player
 */
export class Player<T extends APIPlayer = APIPlayer> extends BasePlayer<T> {
	/**
	 * The achievements of this player
	 */
	achievements: PlayerAchievementManager;

	/**
	 * The arena this player is currently in
	 */
	arena!: Arena;

	/**
	 * The badges of this player
	 */
	badges: PlayerBadgeManager;

	/**
	 * The number of battle this player has participated in
	 */
	battleCount!: number;

	/**
	 * The best number of trophies this player has ever achieved
	 */
	bestTrophies!: number;

	/**
	 * The cards of this player
	 */
	cards: PlayerCardManager;

	/**
	 * The number of cards won in challenges
	 */
	cardsWonInChallenges!: number;

	/**
	 * The clan of this player
	 */
	clan?: Clan;

	/**
	 * The deck of this player
	 */
	deck: PlayerCardManager;

	/**
	 * The number of donations this player has made this week
	 */
	donationsPerWeek!: number;

	/**
	 * The number of donations this player has received this week
	 */
	donationsReceivedPerWeek!: number;

	/**
	 * The exp points of this player
	 */
	expPoints!: number;

	/**
	 * The most used card of this player
	 */
	favouriteCard!: PlayerCard;

	/**
	 * The experience/king level of this player
	 */
	kingLevel!: number;

	/**
	 * League statistics of this player
	 */
	leagueStatistics?: APILeagueStatistics;

	/**
	 * The number of matches this player has lost
	 */
	losses!: number;

	/**
	 * The maximum number of wins in a challenge this player has
	 */
	maxWinsInChallenge!: number;

	/**
	 * The number of cards this player had collected in the old war
	 */
	oldClanCardsCollected!: number;

	/**
	 * The number of wins this player had in the old war day
	 */
	oldWarDayWins!: number;

	/**
	 * The role of this player
	 */
	role!: ClanMemberRole;

	/**
	 * The star points of this player
	 */
	starPoints!: number;

	/**
	 * The number of three crown wins this player has
	 */
	threeCrownWins!: number;

	/**
	 * The total number of donations this player has made
	 */
	totalDonations!: number;

	/**
	 * The number of matches this player has played in tournaments
	 */
	tournamentBattleCount!: number;

	/**
	 * Number of cards won in tournaments
	 */
	tournamentCardsWon!: number;

	/**
	 * The number of trophies this player has
	 */
	trophies!: number;

	/**
	 * Number of decks used in war today
	 */
	warDecksUsedToday!: number;

	/**
	 * The number of matches this player has won
	 */
	wins!: number;

	/**
	 * @param client - The client that instantiated this player
	 * @param data - The data of the player
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.badges = new PlayerBadgeManager(this.client, this, data.badges);
		this.achievements = new PlayerAchievementManager(
			this.client,
			this,
			data.achievements
		);
		this.cards = new PlayerCardManager(this.client, this, data.cards);
		this.deck = new PlayerCardManager(this.client, this, data.currentDeck);
		this.patch({
			...data,
			badges: undefined,
			achievements: undefined,
			cards: undefined,
			currentDeck: undefined,
		});
	}

	/**
	 * The number of matches finished with a draw
	 */
	get draws(): number {
		return this.battleCount - this.wins - this.losses;
	}

	/**
	 * If this player's current trophies are the highest they've ever achieved
	 */
	get isBestTrophies(): boolean {
		return this.trophies >= this.bestTrophies;
	}

	/**
	 * This player as a clan member
	 */
	get member(): ClanMember | null {
		return this.clan?.members.get(this.tag) ?? null;
	}

	/**
	 * The percentual of three crown wins of this player
	 */
	get threeCrownWinPercentage(): number {
		return (this.threeCrownWins / this.wins) * 100;
	}

	/**
	 * The percentual of matches won by this player
	 */
	get winPercentage(): number {
		return (this.wins / this.battleCount) * 100;
	}

	/**
	 * Clone this player.
	 * @returns The cloned player
	 */
	clone(): Player<T> {
		return new Player(this.client, this.toJson());
	}

	/**
	 * Checks whether this player is equal to another player.
	 * @param player - The player to compare to
	 * @returns Whether the players are equal
	 */
	equals(player: Player<T>): boolean {
		return (
			super.equals(player) &&
			this.arena.id === player.arena.id &&
			this.clan?.tag === player.clan?.tag &&
			this.donationsPerWeek === player.donationsPerWeek &&
			this.donationsReceivedPerWeek === player.donationsReceivedPerWeek &&
			this.kingLevel === player.kingLevel &&
			this.role === player.role &&
			this.trophies === player.trophies &&
			this.bestTrophies === player.bestTrophies &&
			this.wins === player.wins &&
			this.losses === player.losses &&
			this.battleCount === player.battleCount &&
			this.threeCrownWins === player.threeCrownWins &&
			this.cardsWonInChallenges === player.cardsWonInChallenges &&
			this.maxWinsInChallenge === player.maxWinsInChallenge &&
			this.tournamentBattleCount === player.tournamentBattleCount &&
			this.totalDonations === player.totalDonations &&
			this.oldWarDayWins === player.oldWarDayWins &&
			this.oldClanCardsCollected === player.oldClanCardsCollected &&
			isEqual(this.leagueStatistics, player.leagueStatistics) &&
			this.badges.every((badge) => player.badges.has(badge.id)) &&
			this.achievements.every((achievement) =>
				player.achievements.has(achievement.id)
			) &&
			this.cards.every((card) => player.cards.has(card.id)) &&
			this.deck.every((card) => player.deck.has(card.id)) &&
			this.favouriteCard.id === player.favouriteCard.id &&
			this.starPoints === player.starPoints &&
			this.expPoints === player.expPoints &&
			this.tournamentCardsWon === player.tournamentCardsWon &&
			this.warDecksUsedToday === player.warDecksUsedToday
		);
	}

	/**
	 * Fetches this player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new player
	 */
	fetch(options?: FetchOptions): Promise<this> {
		return super.fetch(options) as Promise<this>;
	}

	/**
	 * Checks whether this player is in a clan.
	 * @returns Whether this player is in a clan
	 */
	isInClan(): this is { clan: NonNullable<Player<T>["clan"]> } {
		return this.clan !== undefined;
	}

	/**
	 * Checks whether this player is in a league.
	 * @returns Whether this player is in a league
	 */
	isInLeague(): this is {
		leagueStatistics: NonNullable<Player<T>["leagueStatistics"]>;
	} {
		return this.leagueStatistics !== undefined;
	}

	/**
	 * Patches this player.
	 * @param data - The data to update this player with
	 * @returns The updated player
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.role !== undefined) this.role = ClanMemberRole[data.role];
		if (data.arena !== undefined)
			this.arena = this.client.arenas.add(data.arena);
		if (data.achievements !== undefined) {
			this.achievements.clear();
			for (const achievement of data.achievements)
				this.achievements.add(achievement);
		}
		if (data.badges !== undefined) {
			this.badges.clear();
			for (const badge of data.badges) this.badges.add(badge);
		}
		if (data.battleCount !== undefined) this.battleCount = data.battleCount;
		if (data.bestTrophies !== undefined) this.bestTrophies = data.bestTrophies;
		if (data.cards !== undefined) {
			this.cards.clear();
			for (const card of data.cards) this.cards.add(card);
		}
		if (data.challengeCardsWon !== undefined)
			this.cardsWonInChallenges = data.challengeCardsWon;
		if (data.clan !== undefined) this.clan = this.client.clans.add(data.clan);
		if (data.currentDeck !== undefined) {
			this.deck.clear();
			for (const card of data.currentDeck) this.deck.add(card);
		}
		if (data.totalDonations !== undefined)
			this.totalDonations = data.totalDonations;
		if (data.donations !== undefined) this.donationsPerWeek = data.donations;
		if (data.donationsReceived !== undefined)
			this.donationsReceivedPerWeek = data.donationsReceived;
		if (data.expLevel !== undefined) this.kingLevel = data.expLevel;
		if (data.expPoints !== undefined) this.expPoints = data.expPoints;
		if (data.currentFavouriteCard !== undefined)
			this.favouriteCard = this.cards.get(
				`${data.currentFavouriteCard.id}`
			) as PlayerCard;
		if (data.leagueStatistics !== undefined)
			this.leagueStatistics = data.leagueStatistics;
		if (data.losses !== undefined) this.losses = data.losses;
		if (data.challengeMaxWins !== undefined)
			this.maxWinsInChallenge = data.challengeMaxWins;
		if (data.clanCardsCollected !== undefined)
			this.oldClanCardsCollected = data.clanCardsCollected;
		if (data.warDayWins !== undefined) this.oldWarDayWins = data.warDayWins;
		if (data.starPoints !== undefined) this.starPoints = data.starPoints;
		if (data.threeCrownWins !== undefined)
			this.threeCrownWins = data.threeCrownWins;
		if (data.tournamentBattleCount !== undefined)
			this.tournamentBattleCount = data.tournamentBattleCount;
		if (data.tournamentCardsWon !== undefined)
			this.tournamentCardsWon = data.tournamentCardsWon;
		if (data.trophies !== undefined) this.trophies = data.trophies;
		if (data.wins !== undefined) this.wins = data.wins;

		if (!this.equals(old)) this.client.emit("playerUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this player.
	 * @returns The JSON representation
	 */
	toJson(): APIPlayer {
		return {
			...super.toJson(),
			achievements: this.achievements.map((achievement) =>
				achievement.toJson()
			),
			arena: this.arena.toJson(),
			badges: this.badges.map((badge) => badge.toJson()),
			battleCount: this.battleCount,
			bestTrophies: this.bestTrophies,
			cards: this.cards.map((card) => card.toJson()),
			challengeCardsWon: this.cardsWonInChallenges,
			clan: this.clan?.toJson(),
			currentDeck: this.deck.map((card) => card.toJson()),
			currentFavouriteCard: this.favouriteCard.toJson(),
			donations: this.donationsPerWeek,
			donationsReceived: this.donationsReceivedPerWeek,
			expLevel: this.kingLevel,
			expPoints: this.expPoints,
			totalDonations: this.totalDonations,
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
