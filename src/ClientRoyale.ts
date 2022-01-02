import EventEmitter from "node:events";
import { URLSearchParams } from "node:url";
import type {
	APIRiverRaceLog,
	ClientEvents,
	ClientOptions,
	FetchRiverRaceLogOptions,
} from ".";
import { RiverRaceLogResults } from "./lists";
import {
	ArenaManager,
	CardManager,
	ClanManager,
	ClanPreviewManager,
	ClanResultPreviewManager,
	CurrentRiverRaceManager,
	FinishedRiverRaceManager,
	LocationManager,
	PlayerManager,
} from "./managers";
import Rest from "./rest";
import Constants, { Errors, Routes } from "./util";

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
	 * The rest client
	 */
	api = new Rest(this);

	/**
	 * A manager for arenas
	 */
	arenas = new ArenaManager(this);

	/**
	 * The base URL of the API
	 */
	baseURL: string = Constants.baseURL;

	/**
	 * A manager for cards
	 */
	cards = new CardManager(this);

	/**
	 * A manager for clan previews
	 * This is updated with player clans info
	 */
	clanPreviews = new ClanPreviewManager(this);

	/**
	 * A manager for clan result previews
	 */
	clanResultPreviews = new ClanResultPreviewManager(this);

	/**
	 * A manager for clans
	 */
	clans = new ClanManager(this);

	/**
	 * A manager for finished river races
	 */
	finishedRiverRaces = new FinishedRiverRaceManager(this);

	/**
	 * A manager for locations
	 */
	locations = new LocationManager(this);

	/**
	 * A manager for players
	 */
	players = new PlayerManager(this);

	/**
	 * A manager for clans current river races
	 */
	races = new CurrentRiverRaceManager(this);

	/**
	 * The maximum time in milliseconds passed after the structure was last fetched before fetching again.
	 */
	structureMaxAge: number = Constants.defaultMaxAge;

	/**
	 * The token used for the API
	 */
	token: string = process.env.CLASH_ROYALE_TOKEN!;

	/**
	 * @param options - Options for the client
	 */
	constructor({
		abortTimeout,
		baseURL,
		structureMaxAge,
		token,
	}: ClientOptions = {}) {
		super();

		if (token != null) this.token = token;
		if (!this.token) throw new TypeError(Errors.tokenMissing());
		if (abortTimeout != null) this.abortTimeout = abortTimeout;
		if (baseURL != null) this.baseURL = baseURL;
		if (structureMaxAge != null) this.structureMaxAge = structureMaxAge;
	}

	/**
	 * Fetch the river race log of a clan.
	 * @param options - Options for fetching the river race log
	 * @returns The river race log of a clan
	 */
	async fetchRiverRaceLog(
		options: FetchRiverRaceLogOptions
	): Promise<RiverRaceLogResults> {
		const clan = this.clanPreviews.get(options.tag);
		const query = new URLSearchParams();

		if (options.limit !== undefined) query.append("limit", `${options.limit}`);
		if (options.after !== undefined) query.append("after", options.after);
		if (options.before !== undefined) query.append("before", options.before);

		const log = await this.api.get<APIRiverRaceLog>(
			Routes.RiverRaceLog(options.tag),
			{
				query,
			}
		);

		clan?.riverRaceLog.add(...log.items);
		return new RiverRaceLogResults(this, options, log);
	}
}

export default ClientRoyale;
