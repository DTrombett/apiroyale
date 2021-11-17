export type APIAchievement = {
	completionInfo: null;
	info: string;
	name: string;
	stars: number;
	target: number;
	value: number;
};

export type APIArena = {
	id: number;
	name: string;
};

export type APIBadge = APIBaseBadge | APIMultipleLevelsBadge;

export type APIBaseBadge = {
	name: string;
	progress: number;
};

export type APIBestSeason = APISeason & {
	id: APISeasonId;
};

export type APICard = {
	iconUrls: { medium: APIImageLink<`/cards/${number}/${string}.png`> };
	id: number;
	maxLevel: number;
	name: string;
};

export type APIClan = {
	badgeId: number;
	clanScore: number;
	clanWarTrophies: number;
	description: string;
	donationsPerWeek: number;
	location: APILocation;
	memberList: APIMember[];
	members: number;
	name: string;
	requiredTrophies: number;
	tag: APITag;
	type: APIClanType;
};

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

export type APIClanStanding = {
	badgeId: number;
	clanScore: number;
	fame: number;
	finishTime: APIDate;
	name: string;
	participants: APIRiverRaceLogParticipant[];
	periodPoints: 0;
	repairPoints: 0;
	tag: APITag;
};

export type APIClanType = "closed" | "inviteOnly" | "open";

export type APICurrentSeason = APISeason & {
	bestTrophies: number;
};

export type APIImageLink<P extends string = string> =
	`https://api-assets.clashroyale.com${P}`;

export type APIDate =
	`${number}${number}${number}${number}${number}${number}${number}${number}T${number}${number}${number}${number}${number}${number}.000Z`;

export type APILeagueStatistics = {
	bestSeason: APIBestSeason;
	currentSeason: APICurrentSeason;
	previousSeason: APIPreviousSeason;
};

export type APILocation = {
	countryCode?: string;
	id: number;
	isCountry: boolean;
	name: string;
};

export type APIMember = {
	arena: APIArena;
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
};

export type APIMultipleLevelsBadge = APIBaseBadge & {
	level: number;
	maxLevel: number;
	target: number;
};

export type APIPaging = {
	cursors: {
		after?: string;
		before?: string;
	};
};

export type APIPlayer = {
	achievements: APIAchievement[];
	arena: APIArena;
	badges: APIBadge[];
	battleCount: number;
	bestTrophies: number;
	cards: APIPlayerCard[];
	challengeCardsWon: number;
	challengeMaxWins: number;
	clan: APIClanPreview;
	clanCardsCollected: number;
	currentDeck: APIPlayerCard[];
	currentFavouriteCard: APICard;
	donations: number;
	donationsReceived: number;
	expLevel: number;
	expPoints: number;
	leagueStatistics: APILeagueStatistics;
	losses: number;
	name: string;
	role: APIRole;
	starPoints: number;
	tag: APITag;
	threeCrownWins: number;
	totalDonations: number;
	tournamentBattleCount: number;
	tournamentCardsWon: number;
	trophies: number;
	warDayWins: number;
	wins: number;
};

export type APIPlayerCard = APICard & {
	count: number;
	level: number;
	starLevel?: number;
};

export type APIPreviousSeason = APICurrentSeason & {
	id: APISeasonId;
};

export type APIRole = "coLeader" | "elder" | "leader" | "member";

export type APIList<T> = {
	items: T[];
	paging: APIPaging;
};

export type APIRiverRaceLog = APIList<APIRiverRaceLogEntry>;

export type APIRiverRaceLogEntry = {
	createdDate: APIDate;
	seasonId: number;
	sectionIndex: number;
	standings: APIRiverRaceLogStanding[];
};

export type APIRiverRaceLogParticipant = {
	boatAttacks: number;
	decksUsed: number;
	decksUsedToday: 0;
	fame: number;
	name: string;
	repairPoints: 0;
	tag: APITag;
};

export type APIRiverRaceLogStanding = {
	clan: APIClanStanding;
	rank: number;
	trophyChange: number;
};

export type APISeason = {
	trophies: number;
};

export type APISeasonId =
	`${number}${number}${number}${number}-${number}${number}`;

export type APITag = `#${string}`;
