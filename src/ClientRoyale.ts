import EventEmitter from "node:events";
import type { ClientEvents, ClientOptions } from ".";
import {
	BattleListManager,
	ChallengeChainManager,
	ChestListManager,
	ClanManager,
	ClanWarLogManager,
	CurrentRiverRaceManager,
	ItemManager,
	LadderTournamentManager,
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
	 * The maximum time in milliseconds before cancelling a REST request
	 */
	abortTimeout: number = Constants.defaultAbortTimeout;

	/**
	 * The cache of clan war logs
	 */
	clanWarLogs = new ClanWarLogManager(this);

	/**
	 * A manager for clans
	 */
	clans = new ClanManager(this);

	/**
	 * A manager for river race logs
	 */
	riverRaceLogs = new RiverRaceLogEntryManager(this);

	/**
	 * A manager for current river races
	 */
	currentRiverRaces = new CurrentRiverRaceManager(this);

	/**
	 * A manager for upcoming chests
	 */
	upcomingChests = new ChestListManager(this);

	/**
	 * A manager for battle logs
	 */
	battleLogs = new BattleListManager(this);

	/**
	 * A manager for cards
	 */
	cards = new ItemManager(this);

	/**
	 * A manager for tournaments
	 */
	tournaments = new TournamentManager(this);

	/**
	 * A manager for challenges
	 */
	challenges = new ChallengeChainManager(this);

	/**
	 * A manager for global tournaments
	 */
	globalTournaments = new LadderTournamentManager(this);

	/**
	 * The rest client
	 */
	api = new Rest(this);

	/**
	 * The base URL of the API
	 */
	baseURL: string = Constants.baseURL;

	/**
	 * The token used for the API
	 */
	token: string = process.env.CLASH_ROYALE_TOKEN!;

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
	}
}

export default ClientRoyale;
