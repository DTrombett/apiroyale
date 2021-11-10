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
	type: "closed" | "inviteOnly" | "open";
	description: string;
	badgeId: number;
	clanScore: number;
	clanWarTrophies: number;
	location: APILocation;
	requiredTrophies: number;
	donationsPerWeek: number;
	clanChestStatus: "inactive";
	clanChestLevel: 1;
	clanChestMaxLevel: 0;
	members: number;
	memberList: APIMember[];
};

export type APIClanPreview = {
	tag: APITag;
	name: string;
	badgeId: number;
};

export type APICurrentSeason = APISeason & {
	bestTrophies: number;
};

export type APIImageLink<P extends string = string> =
	`https://api-assets.clashroyale.com${P}`;

export type APILastSeen =
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
	lastSeen: APILastSeen;
	expLevel: number;
	trophies: number;
	arena: APIArena;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
	clanChestPoints: 0;
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

export type APISeason = {
	trophies: number;
};

export type APISeasonId =
	`${number}${number}${number}${number}-${number}${number}`;

export type APITag = `#${string}`;
