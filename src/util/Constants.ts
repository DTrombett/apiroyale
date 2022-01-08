import type { Comparator } from "@discordjs/collection";
import type { OutgoingHttpHeaders } from "node:http";
import type { URL, URLSearchParams } from "node:url";
import type ClientRoyale from "..";
import type {
	APIRequest,
	APITag,
	Arena,
	Card,
	Clan,
	ClanCurrentStanding,
	ClanMember,
	ClanPreview,
	ClanResultPreview,
	CurrentRiverRace,
	FinishedRiverRace,
	List,
	Location,
	Player,
	PlayerAchievement,
	PlayerBadge,
	PlayerCard,
	Response,
	RiverRaceParticipant,
	RiverRacePeriod,
	RiverRacePeriodStanding,
	RiverRaceWeekStanding,
	Structure,
} from "..";

/**
 * Events that can be emitted by the client
 */
export interface ClientEvents {
	achievementRemove: [achievement: PlayerAchievement];
	achievementUpdate: [
		oldAchievement: PlayerAchievement,
		newAchievement: PlayerAchievement
	];
	arenaRemove: [arena: Arena];
	arenaUpdate: [oldArena: Arena, newArena: Arena];
	badgeRemove: [badge: PlayerBadge];
	badgeUpdate: [oldBadge: PlayerBadge, newBadge: PlayerBadge];
	cardRemove: [card: Card];
	cardUpdate: [oldCard: Card, newCard: Card];
	chunk: [chunk: string];
	clanCurrentStandingRemove: [clan: ClanCurrentStanding];
	clanCurrentStandingUpdate: [
		oldStanding: ClanCurrentStanding,
		newStanding: ClanCurrentStanding
	];
	clanMemberRemove: [member: ClanMember];
	clanMemberUpdate: [oldMember: ClanMember, newMember: ClanMember];
	clanPreviewRemove: [clan: ClanPreview];
	clanPreviewUpdate: [oldClan: ClanPreview, newClan: ClanPreview];
	clanRemove: [clan: Clan];
	clanResultPreviewRemove: [clan: ClanResultPreview];
	clanResultPreviewUpdate: [
		oldClan: ClanResultPreview,
		newClan: ClanResultPreview
	];
	clanUpdate: [oldClan: Clan, newClan: Clan];
	currentRiverRaceUpdate: [
		oldCurrentRiverRace: CurrentRiverRace,
		newCurrentRiverRace: CurrentRiverRace
	];
	currentRiverRaceRemove: [currentRiverRace: CurrentRiverRace];
	finishedRiverRaceRemove: [riverRace: FinishedRiverRace];
	finishedRiverRaceUpdate: [
		oldRiverRace: FinishedRiverRace,
		newRiverRace: FinishedRiverRace
	];
	locationRemove: [location: Location];
	locationUpdate: [oldLocation: Location, newLocation: Location];
	newAchievement: [achievement: PlayerAchievement];
	newArena: [arena: Arena];
	newBadge: [badge: PlayerBadge];
	newCard: [card: Card];
	newClan: [clan: Clan];
	newClanCurrentStanding: [clan: ClanCurrentStanding];
	newClanMember: [member: ClanMember];
	newClanPreview: [clan: ClanPreview];
	newClanResultPreview: [clan: ClanResultPreview];
	newCurrentRiverRace: [currentRiverRace: CurrentRiverRace];
	newFinishedRiverRace: [riverRace: FinishedRiverRace];
	newLocation: [location: Location];
	newPlayer: [player: Player];
	newPlayerCard: [card: PlayerCard];
	newRiverRaceParticipant: [participant: RiverRaceParticipant];
	newRiverRacePeriod: [period: RiverRacePeriod];
	newRiverRacePeriodStanding: [standing: RiverRacePeriodStanding];
	newRiverRaceWeekStanding: [standing: RiverRaceWeekStanding];
	playerAchievementUpdate: [
		oldAchievement: PlayerAchievement,
		newAchievement: PlayerAchievement
	];
	playerBadgeUpdate: [oldBadge: PlayerBadge, newBadge: PlayerBadge];
	playerCardRemove: [card: PlayerCard];
	playerCardUpdate: [oldCard: PlayerCard, newCard: PlayerCard];
	playerRemove: [player: Player];
	playerUpdate: [oldMember: Player, newMember: Player];
	requestEnd: [request: Response];
	requestStart: [request: APIRequest];
	riverRaceParticipantRemove: [participant: RiverRaceParticipant];
	riverRaceParticipantUpdate: [
		oldParticipant: RiverRaceParticipant,
		newParticipant: RiverRaceParticipant
	];
	riverRacePeriodRemove: [period: RiverRacePeriod];
	riverRacePeriodStandingRemove: [standing: RiverRacePeriodStanding];
	riverRacePeriodStandingUpdate: [
		oldStanding: RiverRacePeriodStanding,
		newStanding: RiverRacePeriodStanding
	];
	riverRacePeriodUpdate: [
		oldPeriod: RiverRacePeriod,
		newPeriod: RiverRacePeriod
	];
	riverRaceStandingUpdate: [
		oldStanding: RiverRaceWeekStanding,
		newStanding: RiverRaceWeekStanding
	];
	riverRaceUpdate: [
		oldRiverRace: FinishedRiverRace,
		newRiverRace: FinishedRiverRace
	];
	riverRaceWeekStandingRemove: [standing: RiverRaceWeekStanding];
	riverRaceWeekStandingUpdate: [
		oldStanding: RiverRaceWeekStanding,
		newStanding: RiverRaceWeekStanding
	];
}

/**
 * Options to instantiate a client
 */
export interface ClientOptions {
	/**
	 * The maximum time in milliseconds before cancelling a REST request
	 */
	abortTimeout?: number;

	/**
	 * The base URL of the API
	 */
	baseURL?: string;

	/**
	 * The maximum time in milliseconds passed after the structure was last fetched before fetching again
	 */
	structureMaxAge?: number;

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
	 * Default maximum time in milliseconds passed after the structure was last fetched before fetching again
	 */
	defaultMaxAge = 300_000,

	/**
	 * Default maximum time in milliseconds before cancelling a REST request
	 */
	defaultAbortTimeout = 10_000,

	/**
	 * Minimum number of characters in a clan name
	 */
	minClanNameLength = 3,
}

/**
 * The class of a structure
 */
export type ConstructableStructure<
	S extends Omit<typeof Structure, "constructor"> = typeof Structure
> = Omit<S, "constructor"> & {
	prototype: S["prototype"];
	new (client: ClientRoyale, data: any, ...args: any[]): S["prototype"];
};

/**
 * Other parameters required by a structure constructor
 */
export type ConstructorExtras<T extends ConstructableStructure> =
	T extends new (
		client: ClientRoyale,
		data: StructureType<T>,
		...args: infer R
	) => Structure
		? R
		: never;

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
	clanMaxMembersNotPositive: () =>
		"The maximum number of members must be a positive number" as const,
	clanMaxMembersTooLow: () =>
		"The maximum number of members must be greater than or equal to the minimum" as const,
	clanMinMembersNotPositive: () =>
		"The minimum number of members must be a positive number" as const,
	clanMinScoreNotPositive: () =>
		"The minimum score must be a positive number" as const,
	clanNameSearchTooShort: () =>
		`The clan name must be at least ${Constants.minClanNameLength} characters long` as const,
} as const;

/**
 * Options with events to emit when a structure is updated
 */
export interface EventsOptions<T extends ConstructableStructure> {
	/**
	 * The event to emit when a new structure is added
	 */
	add: StructureEvents<T>;

	/**
	 * The event to emit when a structure is removed
	 */
	remove: StructureEvents<T>;

	/**
	 * The event to emit when a structure is updated
	 */
	update: StructureEvents<T>;
}

/**
 * Options to fetch a structure
 */
export interface FetchOptions {
	/**
	 * Whether to skip the cache and fetch from the API
	 */
	force?: boolean;
}

/**
 * Options for fetching a river race log
 */
export interface FetchRiverRaceLogOptions extends ListOptions {
	/**
	 * The tag of the clan
	 */
	tag: APITag;
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
 * A function to fetch a list of objects from the API
 */
export type ListMethod<K extends number | string, V> = (
	options: { [k: string]: any; after?: string; before?: string },
	...args: any[]
) => Promise<List<K, V>>;

/**
 * Base options for fetching a list
 */
export interface ListOptions {
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
export interface ManagerOptions<T extends ConstructableStructure> {
	/**
	 * The event to emit when a new structure is added
	 */
	addEvent: StructureEvents<T>;

	/**
	 * The data to initialize the manager with
	 */
	data?: StructureType<T>[];

	/**
	 * The event to emit when a structure is removed
	 */
	removeEvent: StructureEvents<T>;

	/**
	 * The method to sort the data
	 */
	sortMethod?: Comparator<T["prototype"]["id"], T["prototype"]>;

	/**
	 * The event to emit when a structure is updated
	 */
	updateEvent: StructureEvents<T>;
}

export interface FetchableManagerOptions<T extends ConstructableStructure>
	extends ManagerOptions<T> {
	/**
	 * The route to fetch the data from
	 */
	route: ValueOf<{
		[K in keyof typeof Routes]: Parameters<
			typeof Routes[K]
		>[0] extends T["prototype"]["id"]
			? typeof Routes[K]
			: never;
	}>;
}

/**
 * Makes some properties of a structure non-nullable
 */
export type NonNullableProperties<T, K extends keyof T> = {
	[P in keyof T]-?: P extends K ? NonNullable<T[P]> : T[P];
};

/**
 * The path for a request to the API
 */
export type Path = ReturnType<typeof Routes[keyof typeof Routes]>;

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
	query?: ConstructorParameters<typeof URLSearchParams>[0];
}

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
 * A list of API routes
 */
export const Routes = {
	Cards: () => "/cards" as const,
	Clan: (tag: APITag) => `/clans/${tag}` as const,
	ClanMembers: (tag: APITag) => `/clans/${tag}/members` as const,
	Clans: () => "/clans" as const,
	CurrentRiverRace: (tag: APITag) => `/clans/${tag}/currentriverrace` as const,
	Location: (id: StringId) => `/locations/${id}` as const,
	Player: (tag: APITag) => `/players/${tag}` as const,
	RiverRaceLog: (tag: APITag) => `/clans/${tag}/riverracelog` as const,
} as const;

/**
 * Options for searching a clan
 */
export type SearchClanOptions = ListOptions & {
	/**
	 * Clan location identifier
	 */
	location?: Location | Location["id"];

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
};

/**
 * A stringified id from the API
 */
export type StringId = `${number}`;

/**
 * Client events for a structure
 */
export type StructureEvents<T extends ConstructableStructure> = ValueOf<{
	[K in keyof ClientEvents]: T["prototype"] extends ClientEvents[K][0]
		? ClientEvents[K][0] extends T["prototype"]
			? K
			: never
		: never;
}>;

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
 * A valid token for the API
 */
export type Token = `${string}.${string}.${string}`;

/**
 * Values of an object
 */
export type ValueOf<T> = T extends (infer R)[] | Map<any, infer R>
	? R
	: T[keyof T];

export default Constants;
