import EventEmitter from "node:events";
import type { ClientEvents, ClientOptions, DefaultOptions } from ".";
import {
	BattleListManager,
	ChallengeChainManager,
	ChestListManager,
	ClanManager,
	ClanWarLogManager,
	CurrentRiverRaceManager,
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
import Constants, { Errors } from "./util";

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
	 * The maximum time in milliseconds before cancelling a request
	 */
	abortTimeout: number = Constants.defaultAbortTimeout;

	/**
	 * The rest client
	 */
	api = new Rest(this);

	/**
	 * The base URL of the API
	 */
	baseURL: string = Constants.baseURL;

	/**
	 * Default values for the client
	 */
	defaults: DefaultOptions = {
		defaultCache: true,
		defaultCacheNested: true,
	};

	/**
	 * The token used for the API
	 */
	token: string = process.env.CLASH_ROYALE_TOKEN!;

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
	challenges = new ChallengeChainManager(this);

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

		if (options.token !== undefined) this.token = options.token;
		if (!this.token) throw new TypeError(Errors.tokenMissing());
		if (options.abortTimeout !== undefined)
			this.abortTimeout = options.abortTimeout;
		if (options.baseURL !== undefined) this.baseURL = options.baseURL;
		if (options.defaultCache !== undefined)
			this.defaults.defaultCache = options.defaultCache;
		if (options.defaultCacheNested !== undefined)
			this.defaults.defaultCacheNested = options.defaultCacheNested;
	}
}

export default ClientRoyale;
