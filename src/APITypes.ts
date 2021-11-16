export type APIAchievement = {
	name: string;
	stars: number;
	value: number;
	target: number;
	info: string;
	completionInfo: null;
};

export type APIArena = {
	id: number;
	name: string;
};

export type APIBadge =
	| {
			name: string;
			progress: number;
			level: number;
			maxLevel: number;
			target: number;
	  }
	| {
			name: string;
			progress: number;
	  };

export type APIBestSeason = APISeason & {
	id: APISeasonId;
};

export type APICard = {
	name: string;
	id: number;
	maxLevel: number;
	iconUrls: {
		medium: APIImageLink<`/cards/${number}/${string}.png`>;
	};
};

export type APIClan = {
	tag: APITag;
	name: string;
	type: APIClanType;
	description: string;
	badgeId: number;
	clanScore: number;
	clanWarTrophies: number;
	location: APILocation;
	requiredTrophies: number;
	donationsPerWeek: number;
	members: number;
	memberList: APIMember[];
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
	tag: APITag;
	name: string;
	badgeId: number;
	fame: number;
	repairPoints: 0;
	finishTime: APIDate;
	periodPoints: 0;
	clanScore: number;
	participants: APIRiverRaceLogParticipant[];
};

export type APIClanType = "closed" | "inviteOnly" | "open";

export type APICurrentSeason = APISeason & {
	bestTrophies: number;
};

export type APIImageLink<P extends string = string> =
	`https://api-assets.clashroyale.com${P}`;

export type APIDate =
	`${number}${number}${number}${number}${number}${number}${number}${number}T${number}${number}${number}${number}${number}${number}.000Z`;

export type APILocation = {
	id: number;
	name: string;
	isCountry: boolean;
	countryCode?: string;
};

export type APIMember = {
	tag: APITag;
	name: string;
	role: APIRole;
	lastSeen: APIDate;
	expLevel: number;
	trophies: number;
	arena: APIArena;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
};

export type APIPaging = {
	cursors: {
		before?: string;
		after?: string;
	};
};

export type APIPlayer = {
	tag: APITag;
	name: string;
	expLevel: number;
	trophies: number;
	bestTrophies: number;
	wins: number;
	losses: number;
	battleCount: number;
	threeCrownWins: number;
	challengeCardsWon: number;
	challengeMaxWins: number;
	tournamentCardsWon: number;
	tournamentBattleCount: number;
	role: APIRole;
	donations: number;
	donationsReceived: number;
	totalDonations: number;
	warDayWins: number;
	clanCardsCollected: number;
	clan: APIClanPreview;
	arena: APIArena;
	leagueStatistics: {
		currentSeason: APICurrentSeason;
		previousSeason: APIPreviousSeason;
		bestSeason: APIBestSeason;
	};
	badges: APIBadge[];
	achievements: APIAchievement[];
	cards: APIPlayerCard[];
	currentDeck: APIPlayerCard[];
	currentFavouriteCard: APICard;
	starPoints: number;
	expPoints: number;
};

export type APIPlayerCard = APICard & {
	level: number;
	starLevel?: number;
	count: number;
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
	seasonId: number;
	sectionIndex: number;
	createdDate: APIDate;
	standings: APIRiverRaceLogStanding[];
};

export type APIRiverRaceLogParticipant = {
	tag: APITag;
	name: string;
	fame: number;
	repairPoints: 0;
	boatAttacks: number;
	decksUsed: number;
	decksUsedToday: 0;
};

export type APIRiverRaceLogStanding = {
	rank: number;
	trophyChange: number;
	clan: APIClanStanding;
};

export type APISeason = {
	trophies: number;
};

export type APISeasonId =
	`${number}${number}${number}${number}-${number}${number}`;

export type APITag = `#${string}`;
