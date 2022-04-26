import EventEmitter from "node:events";
import type { ClientEvents, ClientOptions, DefaultOptions } from ".";
import {
	ArenaManager,
	BattleListManager,
	ChallengeChainManager,
	ChallengeManager,
	ChestListManager,
	ClanManager,
	ClanWarLogManager,
	CurrentRiverRaceManager,
	GameModeManager,
	ItemManager,
	LadderTournamentManager,
	LadderTournamentRankingManager,
	LeagueSeasonManager,
	LocationManager,
	PlayerManager,
	RiverRaceLogEntryManager,
	TournamentManager,
} from "./managers";
import Rest from "./rest";

/**
 * A class to connect to the Clash Royale API
 */
export interface ClientRoyale extends EventEmitter {
	on: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	once: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	addListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	removeListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	off: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	prependOnListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	prependOnceListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	emit<T extends keyof ClientEvents>(
		event: T,
		...args: ClientEvents[T]
	): boolean;
}

/**
 * A class to connect to the Clash Royale API
 */
export class ClientRoyale extends EventEmitter {
	/**
	 * The rest client
	 */
	api: Rest;

	/**
	 * Default values for the client
	 */
	defaults: DefaultOptions = {
		defaultCache: true,
		defaultCacheNested: true,
	};

	/**
	 * A manager for arenas
	 */
	arenas = new ArenaManager(this);

	/**
	 * A manager for battle logs
	 */
	battleLogs = new BattleListManager(this);

	/**
	 * A manager for cards
	 */
	cards = new ItemManager(this);

	/**
	 * A manager for challenges
	 */
	challenges = new ChallengeManager(this);

	/**
	 * A manager for challenge chains
	 */
	challengeChains = new ChallengeChainManager(this);

	/**
	 * A manager for clans
	 */
	clans = new ClanManager(this);

	/**
	 * The cache of clan war logs
	 * @deprecated **The WarLog API endpoint has been temporarily disabled, possibilities to bring it back are being investigated.
	 * Use {@link RiverRaceLogEntryManager} instead**
	 */
	clanWarLogs = new ClanWarLogManager(this);

	/**
	 * A manager for current river races
	 */
	currentRiverRaces = new CurrentRiverRaceManager(this);

	/**
	 * A manager for game modes
	 */
	gameModes = new GameModeManager(this);

	/**
	 * A manager for global tournament rankings
	 */
	globalTournamentRankings = new LadderTournamentRankingManager(this);

	/**
	 * A manager for global tournaments
	 */
	globalTournaments = new LadderTournamentManager(this);

	/**
	 * A manager for river race logs
	 */
	riverRaceLogs = new RiverRaceLogEntryManager(this);

	/**
	 * A manager for tournaments
	 */
	tournaments = new TournamentManager(this);

	/**
	 * A manager for upcoming chests
	 */
	upcomingChests = new ChestListManager(this);

	/**
	 * A manager for seasons
	 */
	seasons = new LeagueSeasonManager(this);

	/**
	 * A manager for locations
	 */
	locations = new LocationManager(this);

	/**
	 * A manager for players
	 */
	players = new PlayerManager(this);

	/**
	 * @param options - Options for the client
	 */
	constructor(options: ClientOptions = {}) {
		super();

		this.api = new Rest(this, options);
		if (options.defaultCache !== undefined)
			this.defaults.defaultCache = options.defaultCache;
		if (options.defaultCacheNested !== undefined)
			this.defaults.defaultCacheNested = options.defaultCacheNested;
	}
}

export default ClientRoyale;
