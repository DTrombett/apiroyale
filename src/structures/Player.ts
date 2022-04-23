import type ClientRoyale from "..";
import type {
	APIPlayer,
	APIPlayerLeagueStatistics,
	APIPlayerRole,
	Arena,
	Clan,
	ClanMember,
	FetchOptions,
	PlayerCard,
} from "..";
import {
	PlayerAchievementManager,
	PlayerBadgeManager,
	PlayerCardManager,
} from "../managers";
import { isEqual } from "../util";
import BasePlayer from "./BasePlayer";

/**
 * A player
 */
export class Player<T extends APIPlayer = APIPlayer> extends BasePlayer<T> {
	/**
	 * The achievements of this player
	 */
	readonly achievements: PlayerAchievementManager;

	/**
	 * The arena this player is currently in
	 */
	readonly arena: Arena;

	/**
	 * The badges of this player
	 */
	readonly badges: PlayerBadgeManager;

	/**
	 * The number of battle this player has participated in
	 */
	battleCount: number;

	/**
	 * The best number of trophies this player has ever achieved
	 */
	bestTrophies: number;

	/**
	 * The cards of this player
	 */
	readonly cards: PlayerCardManager;

	/**
	 * The number of cards won in challenges
	 */
	cardsWonInChallenges: number;

	/**
	 * The clan of this player
	 */
	clan?: Clan;

	/**
	 * The deck of this player
	 */
	readonly deck: PlayerCardManager;

	/**
	 * The number of donations this player has made this week
	 */
	donationsPerWeek: number;

	/**
	 * The number of donations this player has received this week
	 */
	donationsReceivedPerWeek: number;

	/**
	 * The exp points of this player
	 */
	expPoints: number;

	/**
	 * The most used card of this player, if any
	 */
	favouriteCard?: PlayerCard;

	/**
	 * The experience/king level of this player
	 */
	kingLevel: number;

	/**
	 * League statistics of this player
	 */
	leagueStatistics?: APIPlayerLeagueStatistics;

	/**
	 * The number of matches this player has lost
	 */
	losses: number;

	/**
	 * The maximum number of wins in a challenge this player has
	 */
	maxWinsInChallenge: number;

	/**
	 * The number of cards this player had collected in the old war
	 */
	oldClanCardsCollected: number;

	/**
	 * The number of wins this player had in the old war day
	 */
	oldWarDayWins: number;

	/**
	 * The role of this player
	 */
	role: APIPlayerRole;

	/**
	 * The star points of this player
	 */
	starPoints = 0;

	/**
	 * The number of three crown wins this player has
	 */
	threeCrownWins: number;

	/**
	 * The total number of donations this player has made
	 */
	totalDonations: number;

	/**
	 * The number of matches this player has played in tournaments
	 */
	tournamentBattleCount: number;

	/**
	 * Number of cards won in tournaments
	 */
	tournamentCardsWon: number;

	/**
	 * The number of trophies this player has
	 */
	trophies: number;

	/**
	 * The number of matches this player has won
	 */
	wins: number;

	/**
	 * @param client - The client that instantiated this player
	 * @param data - The data of the player
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);

		this.achievements = new PlayerAchievementManager(
			this.client,
			this,
			data.achievements
		);
		this.arena = this.client.arenas.add(data.arena);
		this.badges = new PlayerBadgeManager(this.client, this, data.badges);
		this.cards = new PlayerCardManager(this.client, this, data.cards);
		this.deck = new PlayerCardManager(this.client, this, data.currentDeck);
		this.clan = data.clan ? this.client.clanPreviews.add(data.clan) : undefined;
		this.battleCount = data.battleCount;
		this.bestTrophies = data.bestTrophies;
		this.cardsWonInChallenges = data.challengeCardsWon;
		this.maxWinsInChallenge = data.challengeMaxWins;
		this.oldClanCardsCollected = data.clanCardsCollected;
		if (data.currentFavouriteCard !== undefined)
			this.favouriteCard = this.cards.get(
				`${data.currentFavouriteCard.id}`
			) as PlayerCard;
		this.donationsPerWeek = data.donations;
		this.donationsReceivedPerWeek = data.donationsReceived;
		this.kingLevel = data.expLevel;
		this.expPoints = data.expPoints;
		this.leagueStatistics = data.leagueStatistics;
		this.losses = data.losses;
		this.role = data.role;
		if (data.starPoints !== undefined) this.starPoints = data.starPoints;
		this.threeCrownWins = data.threeCrownWins;
		this.totalDonations = data.totalDonations;
		this.tournamentBattleCount = data.tournamentBattleCount;
		this.tournamentCardsWon = data.tournamentCardsWon;
		this.trophies = data.trophies;
		this.oldWarDayWins = data.warDayWins;
		this.wins = data.wins;
	}

	/**
	 * If this player's current trophies are the highest they've ever achieved
	 */
	get isBestTrophies(): boolean {
		return this.trophies >= this.bestTrophies;
	}

	/**
	 * The percentual of matches lost by this player
	 */
	get lossPercentage(): number {
		const winAndLosses = this.wins + this.losses;

		return winAndLosses !== 0 ? (this.losses / winAndLosses) * 100 : 0;
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
		return this.wins !== 0 ? (this.threeCrownWins / this.wins) * 100 : 0;
	}

	/**
	 * The percentual of matches won by this player
	 */
	get winPercentage(): number {
		const winAndLosses = this.wins + this.losses;

		return winAndLosses !== 0 ? (this.wins / winAndLosses) * 100 : 0;
	}

	/**
	 * Clone this player.
	 * @returns The cloned player
	 */
	clone(): Player<T> {
		return new Player(this.client, this.toJSON());
	}

	/**
	 * Check whether this player is equal to another player.
	 * @param player - The player to compare to
	 * @returns Whether the players are equal
	 */
	equals(player: Player<T>): player is this {
		return (
			super.equals(player) &&
			this.achievements.equals(player.achievements) &&
			this.arena.id === player.arena.id &&
			this.badges.equals(player.badges) &&
			this.battleCount === player.battleCount &&
			this.bestTrophies === player.bestTrophies &&
			this.cards.equals(player.cards) &&
			this.cardsWonInChallenges === player.cardsWonInChallenges &&
			this.clan?.tag === player.clan?.tag &&
			this.deck.equals(player.deck) &&
			this.donationsPerWeek === player.donationsPerWeek &&
			this.donationsReceivedPerWeek === player.donationsReceivedPerWeek &&
			this.expPoints === player.expPoints &&
			this.favouriteCard?.id === player.favouriteCard?.id &&
			this.kingLevel === player.kingLevel &&
			isEqual(this.leagueStatistics, player.leagueStatistics) &&
			this.losses === player.losses &&
			this.maxWinsInChallenge === player.maxWinsInChallenge &&
			this.oldClanCardsCollected === player.oldClanCardsCollected &&
			this.oldWarDayWins === player.oldWarDayWins &&
			this.role === player.role &&
			this.starPoints === player.starPoints &&
			this.threeCrownWins === player.threeCrownWins &&
			this.totalDonations === player.totalDonations &&
			this.tournamentBattleCount === player.tournamentBattleCount &&
			this.tournamentCardsWon === player.tournamentCardsWon &&
			this.trophies === player.trophies &&
			this.wins === player.wins
		);
	}

	/**
	 * Fetch this player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new player
	 */
	fetch(options?: FetchOptions): Promise<this> {
		return super.fetch(options) as Promise<this>;
	}

	/**
	 * Check whether this player is in a clan.
	 * @returns Whether this player is in a clan
	 */
	isInClan(): this is { clan: NonNullable<Player<T>["clan"]> } {
		return this.clan !== undefined;
	}

	/**
	 * Patch this player.
	 * @param data - The data to patch this player with
	 * @returns The patched player
	 */
	patch(data: Partial<T>): this {
		if (data.achievements !== undefined)
			this.achievements.overrideItems(...data.achievements);
		if (data.arena !== undefined) this.arena.patch(data.arena);
		if (data.badges !== undefined) this.badges.overrideItems(...data.badges);
		if (data.battleCount !== undefined) this.battleCount = data.battleCount;
		if (data.bestTrophies !== undefined) this.bestTrophies = data.bestTrophies;
		if (data.cards !== undefined) this.cards.overrideItems(...data.cards);
		if (data.challengeCardsWon !== undefined)
			this.cardsWonInChallenges = data.challengeCardsWon;
		if (data.challengeMaxWins !== undefined)
			this.maxWinsInChallenge = data.challengeMaxWins;
		if (data.clan !== undefined)
			this.clan = this.client.clanPreviews.add(data.clan);
		if (data.clanCardsCollected !== undefined)
			this.oldClanCardsCollected = data.clanCardsCollected;
		if (data.currentDeck !== undefined)
			this.deck.overrideItems(...data.currentDeck);
		if (data.currentFavouriteCard !== undefined)
			this.favouriteCard = this.cards.get(
				`${data.currentFavouriteCard.id}`
			) as PlayerCard;
		if (data.donations !== undefined) this.donationsPerWeek = data.donations;
		if (data.donationsReceived !== undefined)
			this.donationsReceivedPerWeek = data.donationsReceived;
		if (data.expLevel !== undefined) this.kingLevel = data.expLevel;
		if (data.expPoints !== undefined) this.expPoints = data.expPoints;
		if (data.leagueStatistics !== undefined)
			this.leagueStatistics = data.leagueStatistics;
		if (data.losses !== undefined) this.losses = data.losses;
		if (data.role !== undefined) this.role = data.role;
		if (data.starPoints !== undefined) this.starPoints = data.starPoints;
		if (data.threeCrownWins !== undefined)
			this.threeCrownWins = data.threeCrownWins;
		if (data.totalDonations !== undefined)
			this.totalDonations = data.totalDonations;
		if (data.tournamentBattleCount !== undefined)
			this.tournamentBattleCount = data.tournamentBattleCount;
		if (data.tournamentCardsWon !== undefined)
			this.tournamentCardsWon = data.tournamentCardsWon;
		if (data.trophies !== undefined) this.trophies = data.trophies;
		if (data.warDayWins !== undefined) this.oldWarDayWins = data.warDayWins;
		if (data.wins !== undefined) this.wins = data.wins;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this player.
	 * @returns The JSON representation of this player
	 */
	toJSON(): APIPlayer {
		return {
			...super.toJSON(),
			achievements: this.achievements.map((achievement) =>
				achievement.toJSON()
			),
			arena: this.arena.toJSON(),
			badges: this.badges.map((badge) => badge.toJSON()),
			battleCount: this.battleCount,
			bestTrophies: this.bestTrophies,
			cards: this.cards.map((card) => card.toJSON()),
			challengeCardsWon: this.cardsWonInChallenges,
			clan: this.clan?.toJSON(),
			currentDeck: this.deck.map((card) => card.toJSON()),
			currentFavouriteCard: this.favouriteCard?.toJSON(),
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
			role: this.role,
			starPoints: this.starPoints,
			threeCrownWins: this.threeCrownWins,
			tournamentBattleCount: this.tournamentBattleCount,
			tournamentCardsWon: this.tournamentCardsWon,
			trophies: this.trophies,
			wins: this.wins,
		};
	}
}

export default Player;
