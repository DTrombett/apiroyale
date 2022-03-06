import type Collection from "@discordjs/collection";
import EventEmitter from "node:events";
import { URLSearchParams } from "node:url";
import type {
	APIClanMemberList,
	APIRiverRaceLog,
	APITag,
	APIUpcomingChests,
	Clan,
	ClanMember,
	ClanPreview,
	ClanResultPreview,
	ClientEvents,
	ClientOptions,
	FetchClanMembersOptions,
	FetchPlayerUpcomingChestsOptions,
	FetchRiverRaceLogOptions,
	Player,
} from ".";
import { ClanMemberList, RiverRaceLogResults } from "./lists";
import {
	ArenaManager,
	CardManager,
	ClanManager,
	ClanPreviewManager,
	ClanResultPreviewManager,
	CurrentRiverRaceManager,
	LocationManager,
	PlayerManager,
	UpcomingChestManager,
} from "./managers";
import Rest from "./rest";
import Constants, { Errors, Routes } from "./util";
import schemaError from "./util/schemaError";
import {
	validateClientOptions,
	validateFetchClanMembersOptions,
	validateFetchPlayerUpcomingChestsOptions,
	validateFetchRiverRaceLogOptions,
} from "./util/schemas";

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
	constructor(options: ClientOptions = {}) {
		super();
		if (!validateClientOptions(options))
			throw schemaError(validateClientOptions, "options", "ClientOptions");

		if (options.token != null) this.token = options.token;
		if (!this.token) throw new TypeError(Errors.tokenMissing());
		if (options.abortTimeout != null) this.abortTimeout = options.abortTimeout;
		if (options.baseURL != null) this.baseURL = options.baseURL;
		if (options.structureMaxAge != null)
			this.structureMaxAge = options.structureMaxAge;
	}

	/**
	 * A collection of all the clans cached
	 */
	get allClans(): Collection<APITag, Clan | ClanPreview | ClanResultPreview> {
		return (this.clanPreviews as Collection<APITag, unknown>).concat(
			this.clanResultPreviews,
			this.clans
		) as Collection<APITag, Clan | ClanPreview | ClanResultPreview>;
	}

	/**
	 * A collection of all the players cached
	 */
	get allPlayers(): Collection<APITag, ClanMember | Player> {
		return (this.players as Collection<APITag, unknown>).concat(
			...this.clans.map((clan) => clan.members)
		) as Collection<APITag, ClanMember | Player>;
	}

	/**
	 * Fetch the river race log of a clan.
	 * @param options - Options for fetching the river race log
	 * @returns The river race log of a clan
	 */
	async fetchRiverRaceLog(
		options: FetchRiverRaceLogOptions
	): Promise<RiverRaceLogResults> {
		if (!validateFetchRiverRaceLogOptions(options))
			throw schemaError(
				validateFetchRiverRaceLogOptions,
				"options",
				"FetchRiverRaceLogOptions"
			);
		const clan = this.allClans.get(options.tag);
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

	/**
	 * Fetch the upcoming chests of a player.
	 * @param options - Options for fetching the upcoming chests
	 * @returns The upcoming chests of a player
	 */
	async fetchPlayerUpcomingChests<T extends UpcomingChestManager>(
		options: FetchPlayerUpcomingChestsOptions
	): Promise<T> {
		if (!validateFetchPlayerUpcomingChestsOptions(options))
			throw schemaError(
				validateFetchPlayerUpcomingChestsOptions,
				"options",
				"FetchPlayerUpcomingChestsOptions"
			);
		const player = this.allPlayers.get(options.tag);

		if (
			!options.force! &&
			player &&
			Date.now() - (player.upcomingChests.first()?.lastUpdate.getTime() ?? 0) <
				this.structureMaxAge
		)
			return player.upcomingChests as T;
		const { items: chests } = await this.api.get<APIUpcomingChests>(
			Routes.UpcomingChests(options.tag)
		);

		return (player?.upcomingChests.add(...chests) ??
			new UpcomingChestManager(this, chests)) as T;
	}

	/**
	 * Fetch the members of a clan.
	 * @param options - Options for fetching the members
	 * @returns The members of a clan
	 */
	async fetchClanMembers(
		options: FetchClanMembersOptions
	): Promise<ClanMemberList> {
		if (!validateFetchClanMembersOptions(options))
			throw schemaError(
				validateFetchClanMembersOptions,
				"options",
				"FetchClanMembersOptions"
			);
		const clan = this.clans.get(options.tag);
		const query = new URLSearchParams();

		if (options.limit !== undefined) query.append("limit", `${options.limit}`);
		if (options.after !== undefined) query.append("after", options.after);
		if (options.before !== undefined) query.append("before", options.before);

		const members = await this.api.get<APIClanMemberList>(
			Routes.ClanMembers(options.tag),
			{
				query,
			}
		);

		clan?.members.add(...members.items);
		return new ClanMemberList(this, options, members);
	}
}

export default ClientRoyale;
