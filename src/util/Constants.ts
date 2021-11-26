import type { OutgoingHttpHeaders } from "node:http";
import type { URL, URLSearchParams } from "node:url";
import type ClientRoyale from "..";
import type {
	APIRequest,
	Arena,
	Clan,
	Player,
	FetchableStructure,
	Location,
	Response,
	FinishedRiverRace,
	Structure,
	PlayerBadge,
	PlayerAchievement,
	Card,
	RiverRaceWeekStanding,
	RiverRaceParticipant,
	ClanMember,
	CurrentRiverRace,
	RiverRacePeriodStanding,
	ClanCurrentStanding,
	PlayerCard,
	RiverRacePeriod,
} from "..";
import List from "../lists";

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
	baseAPIUrl = "https://proxy.royaleapi.dev/v1",

	/**
	 * Default maximum time passed after the structure was last fetched before fetching again. (2 minutes)
	 */
	defaultMaxAge = 120_000,

	/**
	 * Default maximum time before cancelling a REST request. (10 seconds)
	 */
	defaultAbortTimeout = 10_000,

	/**
	 * Minimum number of characters in a clan name
	 */
	minClanNameLength = 3,
}

export type ListMethod<K extends number | string, V> = (
	options: { [k: string]: any; after?: string; before?: string },
	...args: any[]
) => Promise<List<K, V>>;

/**
 * Error messages
 */
export const Errors = {
	tokenMissing: () => "No token provided for the client" as const,
	requestAborted: (path: Path) =>
		`Request to path ${path} took more than ${
			Constants.defaultAbortTimeout / 1_000
		} seconds and was aborted before ending` as const,
	requestError: (url: URL, error: Error) =>
		`Request to ${url.href} failed with reason: ${error.message}` as const,
	restRateLimited: () =>
		"The rest is ratelimited so no other requests are allowed until you set the force option to true" as const,
	missingAfter: () => "The next page isn't available" as const,
	missingBefore: () => "The previous page isn't available" as const,
	missingQuery: () => "You didn't provide any query" as const,
	clanNameSearchTooShort: () =>
		`The clan name must be at least ${Constants.minClanNameLength} characters long` as const,
	clanMaxMembersTooLow: () =>
		"The maximum number of members must be greater than or equal to the minimum" as const,
	clanMaxMembersNotPositive: () =>
		"The maximum number of members must be a positive number" as const,
	clanMinMembersNotPositive: () =>
		"The minimum number of members must be a positive number" as const,
	clanMinScoreNotPositive: () =>
		"The minimum score must be a positive number" as const,
} as const;

/**
 * Events that can be emitted by the client
 */
export type ClientEvents = {
	requestStart: [request: APIRequest];
	chunk: [chunk: string];
	requestEnd: [request: Response];
	arenaUpdate: [oldArena: Arena, newArena: Arena];
	clanUpdate: [oldClan: Clan, newClan: Clan];
	playerUpdate: [oldMember: Player, newMember: Player];
	locationUpdate: [oldLocation: Location, newLocation: Location];
	riverRaceUpdate: [
		oldRiverRace: FinishedRiverRace,
		newRiverRace: FinishedRiverRace
	];
	playerBadgeUpdate: [oldBadge: PlayerBadge, newBadge: PlayerBadge];
	playerAchievementUpdate: [
		oldAchievement: PlayerAchievement,
		newAchievement: PlayerAchievement
	];
	cardUpdate: [oldCard: Card, newCard: Card];
	riverRaceStandingUpdate: [
		oldStanding: RiverRaceWeekStanding,
		newStanding: RiverRaceWeekStanding
	];
	riverRaceParticipantUpdate: [
		oldParticipant: RiverRaceParticipant,
		newParticipant: RiverRaceParticipant
	];
	clanMemberUpdate: [oldMember: ClanMember, newMember: ClanMember];
	currentRiverRaceUpdate: [
		oldCurrentRiverRace: CurrentRiverRace,
		newCurrentRiverRace: CurrentRiverRace
	];
	riverRacePeriodStandingUpdate: [
		oldStanding: RiverRacePeriodStanding,
		newStanding: RiverRacePeriodStanding
	];
	newCard: [card: Card];
	cardRemoved: [card: Card];
	newClanCurrentStanding: [clan: ClanCurrentStanding];
	clanCurrentStandingRemoved: [clan: ClanCurrentStanding];
	newClan: [clan: Clan];
	clanRemoved: [clan: Clan];
	newArena: [arena: Arena];
	arenaRemoved: [arena: Arena];
	newClanMember: [member: ClanMember];
	clanMemberRemoved: [member: ClanMember];
	newLocation: [location: Location];
	locationRemoved: [location: Location];
	newAchievement: [achievement: PlayerAchievement];
	achievementRemoved: [achievement: PlayerAchievement];
	newBadge: [badge: PlayerBadge];
	badgeRemoved: [badge: PlayerBadge];
	newPlayerCard: [card: PlayerCard];
	playerCardRemoved: [card: PlayerCard];
	newPlayer: [player: Player];
	playerRemoved: [player: Player];
	newFinishedRiverRace: [riverRace: FinishedRiverRace];
	finishedRiverRaceRemoved: [riverRace: FinishedRiverRace];
	newRiverRaceParticipant: [participant: RiverRaceParticipant];
	riverRaceParticipantRemoved: [participant: RiverRaceParticipant];
	newRiverRacePeriod: [period: RiverRacePeriod];
	riverRacePeriodRemoved: [period: RiverRacePeriod];
	newRiverRacePeriodStanding: [standing: RiverRacePeriodStanding];
	riverRacePeriodStandingRemoved: [standing: RiverRacePeriodStanding];
	newRiverRaceWeekStanding: [standing: RiverRaceWeekStanding];
	riverRaceWeekStandingRemoved: [standing: RiverRaceWeekStanding];
};

export type StructureEvents<T extends ConstructableStructure> = ValueOf<{
	[K in keyof ClientEvents]: T["prototype"] extends ClientEvents[K][0]
		? ClientEvents[K][0] extends T["prototype"]
			? K
			: never
		: never;
}>;

export type EventsOptions<T extends ConstructableStructure> = {
	add?: StructureEvents<T>;
	remove?: StructureEvents<T>;
};

export type ValueOf<T> = T[keyof T];

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
 * A JSON object
 */
export type JsonObject = {
	[property: string]: Json;
};

/**
 * Options for searching a clan
 */
export type SearchClanOptions = ListOptions & {
	/**
	 * The name of the clan.
	 * It needs to be at least three characters long.
	 * Name search parameter is interpreted as wild card search, so it may appear anywhere in the clan name
	 */
	name?: string;

	/**
	 * Clan location identifier
	 */
	location?: Location | Location["id"];

	/**
	 * Minimum number of clan members
	 */
	minMembers?: number;

	/**
	 * Maximum number of clan members
	 */
	maxMembers?: number;

	/**
	 * Minimum amount of clan score
	 */
	minScore?: number;
};

export type FetchRiverRaceLogOptions = ListOptions;

/**
 * Base options for fetching a list
 */
export type ListOptions = {
	/**
	 * Limit the number of items returned in the response
	 */
	limit?: number;

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
};

/**
 * Options to fetch a structure
 */
export type FetchOptions = {
	/**
	 * Whether to skip the cache and fetch from the API
	 */
	force?: boolean;

	/**
	 * Maximum time (in milliseconds) passed after the structure was last fetched before fetching again
	 */
	maxAge?: number;
};

/**
 * The class of a fetchable structure
 */
export type ConstructableFetchableStructure = Omit<
	typeof FetchableStructure,
	"constructor"
> & {
	prototype: FetchableStructure;
	new (client: ClientRoyale, data: any, ...args: any[]): FetchableStructure;
};

/**
 * The options for a request
 */
export type RequestOptions = {
	/**
	 * Headers to be sent for this request
	 */
	headers?: OutgoingHttpHeaders;

	/**
	 * The query of this request
	 */
	query?: ConstructorParameters<typeof URLSearchParams>[0];

	/**
	 * The base url for this request
	 */
	url?: string;
};

/**
 * The status of a request to the API
 */
export enum RequestStatus {
	/**
	 * The request is pending
	 */
	Pending,

	/**
	 * The request is in progress
	 */
	InProgress,

	/**
	 * The request was successful
	 */
	Finished,

	/**
	 * The request failed
	 */
	Failed,
}

/**
 * The path for a request to the API
 */
export type Path = `/${string}`;

/**
 * Options to instantiate a client
 */
export type ClientOptions = {
	/**
	 * The token of this client
	 * This defaults to `process.env.CLASH_ROYALE_TOKEN` if none is provided
	 */
	token?: Token;
};

/**
 * A valid token for the API
 */
export type Token = `${string}.${string}.${string}`;

/**
 * The role of a clan member
 */
export enum ClanMemberRole {
	/**
	 * The member is a member of the clan
	 */
	member,

	/**
	 * The member is an elder of the clan
	 */
	elder,

	/**
	 * The member is a co-leader of the clan
	 */
	coLeader,

	/**
	 * The member is the leader of the clan
	 */
	leader,
}

/**
 * A stringified id from the API
 */
export type StringId = `${number}`;

/**
 * The class of a structure
 */
export type ConstructableStructure<
	S extends Omit<typeof Structure, "constructor"> = typeof Structure
> = Omit<S, "constructor"> & {
	prototype: S["prototype"];
	new (client: ClientRoyale, data: any, ...args: any[]): S["prototype"];
};

export type ConstructorExtras<T extends ConstructableStructure> =
	T extends new (
		client: ClientRoyale,
		data: StructureType<T>,
		...args: infer R
	) => Structure
		? R
		: never;

/**
 * The API type of a structure
 */
export type StructureType<T extends ConstructableStructure> = T extends new (
	client: ClientRoyale,
	data: infer R,
	...args: any[]
) => Structure
	? R
	: never;

/**
 * Makes some properties of a structure non-nullable
 */
export type NonNullableProperties<T, K extends keyof T> = {
	[P in keyof T]-?: P extends K ? NonNullable<T[P]> : T[P];
};

/**
 * A JSON error received from the API
 */
export type ClashRoyaleError = {
	reason: string;
	message?: string;
	type?: string;
	detail?: Record<string, unknown>;
};

/**
 * Represents the type of a clan
 */
export enum ClanType {
	/**
	 * Clan is closed
	 */
	closed,

	/**
	 * The clan is invite only
	 */
	inviteOnly,

	/**
	 * The clan is open
	 */
	open,
}

/**
 * The state of a river race
 */
export enum RiverRaceState {
	/**
	 * The race is full
	 */
	full,
}

/**
 * The type of a war day
 */
export enum RiverRacePeriodType {
	/**
	 * A training day
	 */
	training,

	/**
	 * A war day
	 */
	warDay,
}

export default Constants;
