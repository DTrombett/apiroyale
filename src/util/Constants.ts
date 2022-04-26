import type { OutgoingHttpHeaders } from "node:http";
import type { URL, URLSearchParams } from "node:url";
import type {
	APIArena,
	APIBattleList,
	APIChallenge,
	APIChallengeChain,
	APIChestList,
	APIClan,
	APIClanWarLog,
	APICurrentRiverRace,
	APIGameMode,
	APIItem,
	APILadderTournament,
	APILadderTournamentRanking,
	APILeagueSeason,
	APILocation,
	APIPlayer,
	APIRequest,
	APIRiverRaceLogEntry,
	APITournament,
	Path,
	Response,
	ResponseType,
	ValueOf,
} from "..";

/**
 * Events that can be emitted by the client
 */
export interface ClientEvents {
	requestStart: [request: APIRequest];
	requestEnd: [request: APIRequest, response: Response];
	clanWarLogAdd: [warLog: APIClanWarLog];
	clanWarLogUpdate: [oldWarLog: APIClanWarLog, newWarLog: APIClanWarLog];
	clanAdd: [clan: APIClan];
	clanRemove: [clan: APIClan];
	clanUpdate: [oldClan: APIClan, newClan: APIClan];
	riverRaceLogEntryAdd: [entry: APIRiverRaceLogEntry];
	riverRaceLogEntryRemove: [entry: APIRiverRaceLogEntry];
	riverRaceLogEntryUpdate: [
		oldEntry: APIRiverRaceLogEntry,
		newEntry: APIRiverRaceLogEntry
	];
	currentRiverRaceAdd: [race: APICurrentRiverRace];
	currentRiverRaceRemove: [race: APICurrentRiverRace];
	currentRiverRaceUpdate: [
		oldRace: APICurrentRiverRace,
		newRace: APICurrentRiverRace
	];
	playerAdd: [player: APIPlayer];
	playerRemove: [player: APIPlayer];
	playerUpdate: [oldMember: APIPlayer, newMember: APIPlayer];
	chestListAdd: [chestList: APIChestList];
	chestListRemove: [chestList: APIChestList];
	chestListUpdate: [oldChestList: APIChestList, newChestList: APIChestList];
	battleListAdd: [battleList: APIBattleList];
	battleListRemove: [battleList: APIBattleList];
	battleListUpdate: [
		oldBattleList: APIBattleList,
		newBattleList: APIBattleList
	];
	itemAdd: [item: APIItem];
	itemRemove: [item: APIItem];
	itemUpdate: [oldItem: APIItem, newItem: APIItem];
	tournamentAdd: [tournament: APITournament];
	tournamentRemove: [tournament: APITournament];
	tournamentUpdate: [
		oldTournament: APITournament,
		newTournament: APITournament
	];
	challengeChainAdd: [challengeChain: APIChallengeChain];
	challengeChainRemove: [challengeChain: APIChallengeChain];
	challengeChainUpdate: [
		oldChallengeChain: APIChallengeChain,
		newChallengeChain: APIChallengeChain
	];
	ladderTournamentAdd: [ladderTournament: APILadderTournament];
	ladderTournamentRemove: [ladderTournament: APILadderTournament];
	ladderTournamentUpdate: [
		oldLadderTournament: APILadderTournament,
		newLadderTournament: APILadderTournament
	];
	leagueSeasonAdd: [leagueSeason: APILeagueSeason];
	leagueSeasonRemove: [leagueSeason: APILeagueSeason];
	leagueSeasonUpdate: [
		oldLeagueSeason: APILeagueSeason,
		newLeagueSeason: APILeagueSeason
	];
	locationAdd: [location: APILocation];
	locationRemove: [location: APILocation];
	locationUpdate: [oldLocation: APILocation, newLocation: APILocation];
	ladderTournamentRankingAdd: [
		ladderTournamentRanking: APILadderTournamentRanking
	];
	ladderTournamentRankingRemove: [
		ladderTournamentRanking: APILadderTournamentRanking
	];
	ladderTournamentRankingUpdate: [
		oldLadderTournamentRanking: APILadderTournamentRanking,
		newLadderTournamentRanking: APILadderTournamentRanking
	];
	arenaAdd: [arena: APIArena];
	arenaRemove: [arena: APIArena];
	arenaUpdate: [oldArena: APIArena, newArena: APIArena];
	gameModeAdd: [gameMode: APIGameMode];
	gameModeRemove: [gameMode: APIGameMode];
	gameModeUpdate: [oldGameMode: APIGameMode, newGameMode: APIGameMode];
	challengeAdd: [challenge: APIChallenge];
	challengeRemove: [challenge: APIChallenge];
	challengeUpdate: [oldChallenge: APIChallenge, newChallenge: APIChallenge];
}

/**
 * Options to instantiate a client
 */
export interface ClientOptions extends Partial<CacheOptions> {
	/**
	 * The maximum time in milliseconds before cancelling a REST request
	 */
	abortTimeout?: number;

	/**
	 * The base URL of the API
	 */
	baseURL?: string;

	/**
	 * The token of this client
	 * This defaults to `process.env.CLASH_ROYALE_TOKEN` if none is provided
	 */
	token?: Token;
}

export const enum Constants {
	/**
	 * The value to pass to the `Accept` header
	 */
	acceptHeader = "application/json",

	/**
	 * The prefix to use for the `Authorization` header
	 */
	authorizationHeaderPrefix = "Bearer ",

	/**
	 * The base URL for the API
	 */
	baseURL = "https://api.clashroyale.com/v1",

	/**
	 * Default maximum time in milliseconds before cancelling a REST request
	 */
	defaultAbortTimeout = 10_000,

	/**
	 * Minimum number of characters in a clan name
	 */
	minClanNameLength = 3,

	/**
	 * Minimum number of characters in a tournament name
	 */
	minTournamentNameLength = 3,
}

/**
 * Cache options for the client
 */
export interface CacheOptions {
	/**
	 * Whether to cache a fetched structure
	 */
	cache?: boolean;

	/**
	 * Whether to cache the nested structures of a fetched structure
	 */
	cacheNested?: boolean;
}

/**
 * Error messages
 */
export const Errors = {
	missingAfter: () => "The next page isn't available" as const,
	missingBefore: () => "The previous page isn't available" as const,
	missingQuery: () => "You didn't provide any query" as const,
	requestAborted: (path: Path, maxAge: number) =>
		`Request to path ${path} took more than ${maxAge} milliseconds and was aborted before ending` as const,
	requestError: (url: URL, error: Error) =>
		`Request to ${url.href} failed with reason: ${error.message}` as const,
	restRateLimited: () =>
		"The rest is ratelimited so no other requests are allowed until you set the force option to true" as const,
	tokenMissing: () => "No token provided for the client" as const,
	clanMaxMembersTooLow: () =>
		"The maximum number of members must be greater than or equal to the minimum and positive" as const,
	clanMinMembersNotPositive: () =>
		"The minimum number of members must be a positive number" as const,
	clanMinScoreNotPositive: () =>
		"The minimum score must be a positive number" as const,
	clanNameSearchTooShort: () =>
		`The clan name must be at least ${Constants.minClanNameLength} characters long` as const,
	tournamentNameSearchTooShort: () =>
		`The tournament name must be at least ${Constants.minTournamentNameLength} characters long` as const,
} as const;

/**
 * Options for fetching a clan's members
 */
export interface FetchClanMembersOptions extends ListOptions {
	/**
	 * The tag of the clan
	 */
	tag: string;
}

/**
 * Options to fetch a structure
 */
export interface FetchOptions extends CacheOptions {
	/**
	 * Whether to skip the cache and fetch from the API
	 */
	force?: boolean;
}

/**
 * Options for fetching a player's upcoming chests
 */
export interface FetchPlayerUpcomingChestsOptions {
	/**
	 * Whether to skip the cache and fetch from the API
	 */
	force?: boolean;

	/**
	 * The tag of the player
	 */
	tag: string;
}

/**
 * Options for fetching a river race log
 */
export interface FetchRiverRaceLogOptions extends ListOptions {
	/**
	 * The tag of the clan
	 */
	tag: string;
}

/**
 * Any JSON data
 */
export type Json =
	| Json[]
	| boolean
	| number
	| string
	| { [property: string]: Json }
	| null;

/**
 * Base options for fetching a list
 */
export interface ListOptions extends CacheOptions {
	/**
	 * Return only items that occur after this marker.
	 * This marker can be found in the search results, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both
	 */
	after?: string;

	/**
	 * Return only items that occur before this marker.
	 * This marker can be found in the search results, inside the 'paging' property.
	 * Note that only after or before can be specified for a request, not both
	 */
	before?: string;

	/**
	 * Limit the number of items returned in the response
	 */
	limit?: number;
}

/**
 * Options for creating a manager
 */
export interface ManagerOptions<V> {
	/**
	 * The event to emit when a new structure is added
	 */
	addEvent?: StructureEvents<V>;

	/**
	 * The event to emit when a structure is removed
	 */
	removeEvent?: StructureEvents<V>;

	/**
	 * The event to emit when a structure is updated
	 */
	updateEvent?: StructureEvents<V>;
}

export interface QueuePromise {
	/**
	 * The promise to resolve
	 */
	promise: Promise<void>;

	/**
	 * The resolve function of the promise
	 */
	resolve(): void;
}

/**
 * The options for a request
 */
export interface RequestOptions {
	/**
	 * Headers to be sent for this request
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * The query of this request
	 */
	query?:
		| Iterable<[string, string]>
		| Record<string, string | readonly string[]>
		| URLSearchParams
		| string
		| readonly [string, string][];
}

/**
 * The response returned by the rest
 */
export interface RestResponse<T extends Path> {
	data: ResponseType<T>;
	maxAge: number;
}

/**
 * Options for searching a clan
 */
export interface SearchClanOptions extends ListOptions {
	/**
	 * Clan location identifier
	 */
	location?: number;

	/**
	 * Maximum number of clan members
	 */
	maxMembers?: number;

	/**
	 * Minimum number of clan members
	 */
	minMembers?: number;

	/**
	 * Minimum amount of clan score
	 */
	minScore?: number;

	/**
	 * The name of the clan.
	 * It needs to be at least three characters long.
	 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name
	 */
	name?: string;
}

/**
 * Options for searching a tournament
 */
export interface SearchTournamentOptions extends ListOptions {
	/**
	 * The name of the tournament.
	 * It needs to be at least three characters long.
	 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name
	 */
	name?: string;
}

/**
 * Client events for a structure
 */
export type StructureEvents<V> = ValueOf<{
	[K in keyof ClientEvents]: V extends ClientEvents[K][0]
		? ClientEvents[K][0] extends V
			? K
			: never
		: never;
}>;

/**
 * Options for adding a structure to a manager
 */
export interface StructureOptions extends CacheOptions {
	/**
	 * When this structure should be considered outdated
	 */
	maxAge?: number;
}

/**
 * A valid token for the API
 */
export type Token = `${string}.${string}.${string}`;

export default Constants;
