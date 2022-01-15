export interface APIAchievement {
	completionInfo: null;
	info: string;
	name: string;
	stars: number;
	target: number;
	value: number;
}

export interface APIArena {
	id: number;
	name: string;
}

export type APIBadge = APIBaseBadge | APIMultipleLevelsBadge;

export interface APIBaseBadge {
	name: string;
	progress: number;
}

export type APIBestSeason = APISeason & {
	id: APISeasonId;
};

export interface APICard {
	iconUrls: { medium: APIImageLink<`/cards/${number}/${string}.png`> };
	id: number;
	maxLevel: number;
	name: string;
}

export interface APIClan {
	badgeId: number;
	clanChestLevel: 1;
	clanChestMaxLevel: 0;
	clanChestStatus: "inactive";
	clanScore: number;
	clanWarTrophies: number;
	description: string;
	donationsPerWeek: number;
	location: APILocation;
	memberList: APIClanMember[];
	members: number;
	name: string;
	requiredTrophies: number;
	tag: APITag;
	type: APIClanType;
}

export type APIClanCurrentStanding = Omit<APIClanWeekStanding, "finishTime">;

export interface APIClanMember {
	arena: APIArena;
	clanChestPoints: 0;
	clanRank: number;
	donations: number;
	donationsReceived: number;
	expLevel: number;
	lastSeen: APIDate;
	name: string;
	previousClanRank: number;
	role: APIRole;
	tag: APITag;
	trophies: number;
}

export type APIClanPeriodStanding = Pick<APIClan, "tag">;

export type APIClanPreview = Pick<APIClan, "badgeId" | "name" | "tag">;

export type APIClanResultPreview = Pick<
	APIClan,
	| "badgeId"
	| "clanScore"
	| "clanWarTrophies"
	| "donationsPerWeek"
	| "location"
	| "members"
	| "name"
	| "requiredTrophies"
	| "tag"
	| "type"
>;

export type APIClanSearchResults = APIList<APIClanResultPreview>;

export type APIClanType = "closed" | "inviteOnly" | "open";

export interface APIClanWeekStanding {
	badgeId: number;
	clanScore: number;
	fame: number;
	finishTime: APIDate;
	name: string;
	participants: APIRiverRaceParticipant[];
	periodPoints: number;
	repairPoints: 0;
	tag: APITag;
}

export type APICurrentSeason = APISeason & {
	bestTrophies: number;
};

export interface APICurrentRiverRace {
	clan: APIClanCurrentStanding;
	clans: APIClanCurrentStanding[];
	state: APIRiverRaceState;
	sectionIndex: number;
	periodIndex: number;
	periodType: APIRiverRacePeriodType;
	periodLogs?: APIRiverRacePeriod[];
}

export type APIImageLink<P extends string = string> =
	`https://api-assets.clashroyale.com${P}`;

export type APIDate =
	`${number}${number}${number}${number}${number}${number}${number}${number}T${number}${number}${number}${number}${number}${number}.000Z`;

export interface APIError {
	detail?: Record<string, unknown>;
	message?: string;
	reason: string;
	type?: string;
}

export interface APILeagueStatistics {
	bestSeason: APIBestSeason;
	currentSeason: APICurrentSeason;
	previousSeason: APIPreviousSeason;
}

export interface APILocation {
	countryCode?: string;
	id: number;
	isCountry: boolean;
	name: string;
}

export type APIMultipleLevelsBadge = APIBaseBadge & {
	level: number;
	maxLevel: number;
	target: number;
};

export interface APIPlayer {
	achievements: APIAchievement[];
	arena: APIArena;
	badges: APIBadge[];
	battleCount: number;
	bestTrophies: number;
	cards: APIPlayerCard[];
	challengeCardsWon: number;
	challengeMaxWins: number;
	clan?: APIClanPreview;
	clanCardsCollected: number;
	currentDeck: APIPlayerCard[];
	currentFavouriteCard?: APICard;
	donations: number;
	donationsReceived: number;
	expLevel: number;
	expPoints: number;
	leagueStatistics?: APILeagueStatistics;
	losses: number;
	name: string;
	role: APIRole;
	starPoints?: number;
	tag: APITag;
	threeCrownWins: number;
	totalDonations: number;
	tournamentBattleCount: number;
	tournamentCardsWon: number;
	trophies: number;
	warDayWins: number;
	wins: number;
}

export type APIPlayerCard = APICard & {
	count: number;
	level: number;
	starLevel?: number;
};

export type APIPreviousSeason = APICurrentSeason & {
	id: APISeasonId;
};

export type APIRole = "coLeader" | "elder" | "leader" | "member";

export interface APIList<T> {
	items: T[];
	paging: APIPaging;
}

export interface APIPaging {
	cursors: {
		after?: string;
		before?: string;
	};
}

export type APIRiverRaceLog = APIList<APIRiverRaceLogEntry>;

export interface APIRiverRaceLogEntry {
	createdDate: APIDate;
	seasonId: number;
	sectionIndex: number;
	standings: APIRiverRaceWeekStanding[];
}

export interface APIRiverRaceParticipant {
	boatAttacks: number;
	decksUsed: number;
	decksUsedToday: number;
	fame: number;
	name: string;
	repairPoints: 0;
	tag: APITag;
}

export interface APIRiverRacePeriod {
	periodIndex: number;
	items: APIRiverRacePeriodStanding[];
}

export interface APIRiverRacePeriodStanding {
	clan: APIClanPeriodStanding;
	pointsEarned: number;
	progressStartOfDay: number;
	progressEndOfDay: number;
	endOfDayRank: number;
	progressEarned: number;
	numOfDefensesRemaining: number;
	progressEarnedFromDefenses: number;
}

export type APIRiverRacePeriodType = "training" | "warDay";

export type APIRiverRaceState = "full";

export interface APIRiverRaceWeekStanding {
	clan: APIClanWeekStanding;
	rank: number;
	trophyChange: number;
}

export interface APISeason {
	trophies: number;
}

export type APISeasonId =
	`${number}${number}${number}${number}-${number}${number}`;

export type APITag = `#${string}`;

export interface APIUpcomingChest {
	index: number;
	name: string;
}

export type APIUpcomingChests = Pick<APIList<APIUpcomingChest>, "items">;
