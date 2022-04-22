type integer = number;

export type APILadderTournamentRankingList =
	APIList<APILadderTournamentRanking>;

export interface APILadderTournamentRanking {
	clan: APIPlayerRankingClan;
	wins: integer;
	losses: integer;
	tag: string;
	name: string;
	rank: integer;
	previousRank: integer;
}

export interface APIPlayerRankingClan {
	badgeId: integer;
	tag: string;
	name: string;
}

export interface APICurrentRiverRace {
	state: APIRiverRaceState;
	clan: APIRiverRaceClan;
	clans: APIRiverRaceClanList;
	collectionEndTime: string;
	warEndTime: string;
	sectionIndex: integer;
	periodIndex: integer;
	periodType: APIRiverRacePeriodType;
	periodLogs: APIPeriodLogList;
}

export type APIPeriodLogList = APIPeriodLog[];

export interface APIPeriodLog {
	items: PeriodLogEntryList;
	periodIndex: integer;
}

export type PeriodLogEntryList = APIPeriodLogEntry[];

export interface APIPeriodLogEntry {
	clan: APIPeriodLogEntryClan;
	pointsEarned: integer;
	progressStartOfDay: integer;
	progressEndOfDay: integer;
	endOfDayRank: integer;
	progressEarned: integer;
	numOfDefensesRemaining: integer;
	progressEarnedFromDefenses: integer;
}

export interface APIPeriodLogEntryClan {
	tag: string;
}

export type APIRiverRaceClanList = APIRiverRaceClan[];

export interface APIRiverRaceClan {
	tag: string;
	clanScore: integer;
	badgeId: integer;
	name: string;
	fame: integer;
	repairPoints: integer;
	finishTime?: string;
	participants: APIRiverRaceParticipantList;
	periodPoints: integer;
}

export type APIRiverRaceParticipantList = APIRiverRaceParticipant[];

export interface APIRiverRaceParticipant {
	tag: string;
	name: string;
	fame: integer;
	repairPoints: integer;
	boatAttacks: integer;
	decksUsed: integer;
	decksUsedToday: integer;
}

export interface APILocation {
	localizedName?: string;
	id: integer;
	name: string;
	isCountry: boolean;
	countryCode?: string;
}

export interface Replay {
	replayInfo: string;
	replayData: APIJsonNode;
	version: APIVersion;
	tag: string;
	battleTime: string;
	viewCount: integer;
	shareCount: integer;
}

export interface APIVersion {
	build: integer;
	major: integer;
	content: integer;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface APIJsonNode {}

export type APILocationList = APIList<APILocation>;

export type APILeagueSeasonList = APIList<APILeagueSeason>;

export interface APILeagueSeason {
	id: string;
}

export type APIChallengeChainsList = APIChallengeChain[];

export interface APIChallengeChain {
	title?: string;
	type: APIChallengeChainType;
	startTime: string;
	endTime: string;
	challenges: APIChallengeList;
}

export enum APIChallengeChainType {
	SINGLE_CHALLENGE = "singleChallenge",
	CHAIN_CHALLENGE = "chainChallenge",
}

export type APIChallengeList = APIChallenge[];

export interface APIChallenge {
	description: string;
	name: string;
	id: integer;
	winMode: string;
	casual: boolean;
	maxLosses: integer;
	maxWins: integer;
	iconUrl: string;
	gameMode: APIChallengeGameMode;
	prizes: APISurvivalMilestoneRewardList;
}

export type APISurvivalMilestoneRewardList = APISurvivalMilestoneReward[];

export interface APISurvivalMilestoneReward {
	chest?: string;
	rarity?: APISurvivalMilestoneRewardRarity;
	resource?: APISurvivalMilestoneRewardResource;
	type: APISurvivalMilestoneRewardType | null;
	amount?: integer;
	card?: APIItem & { name: string | null };
	consumableName?: string;
	wins?: integer;
}

export enum APISurvivalMilestoneRewardRarity {
	COMMON = "common",
	RARE = "rare",
	EPIC = "epic",
	LEGENDARY = "legendary",
	HERO = "hero",
}

export enum APISurvivalMilestoneRewardResource {
	GOLD = "gold",
	UNKNOWN = "unknown",
}

export enum APISurvivalMilestoneRewardType {
	NONE = "none",
	CARD_STACK = "cardStack",
	CHEST = "chest",
	CARD_STACK_RANDOM = "cardStackRandom",
	RESOURCE = "resource",
	TRADE_TOKEN = "tradeToken",
	CONSUMABLE = "consumable",
}

export interface APIItem {
	iconUrls: {
		medium: string;
	};
	name: string;
	id: integer;
	maxLevel: integer;
}

export interface APIChallengeGameMode {
	id: integer;
	name: string;
}

export type APIClanMemberList = APIList<APIClanMember>;

export interface APIClanMember {
	clanChestPoints: integer;
	arena: APIArena;
	lastSeen: string;
	tag: string;
	name: string;
	role: APIClanMemberRole;
	expLevel: integer;
	trophies: integer;
	clanRank: integer;
	previousClanRank: integer;
	donations: integer;
	donationsReceived: integer;
}

export enum APIClanMemberRole {
	NOT_MEMBER = "notMember",
	MEMBER = "member",
	LEADER = "leader",
	ADMIN = "admin",
	COLEADER = "coLeader",
}

export interface APIArena {
	name: string;
	id: integer;
}

export type APILadderTournamentList = APIList<APILadderTournament>;

export interface APILadderTournament {
	minExpLevel: integer;
	maxLosses: integer;
	tournamentLevel: integer;
	gameMode: Omit<APIGameMode, "name">;
	milestoneRewards: APISurvivalMilestoneRewardList;
	freeTierRewards: APISurvivalMilestoneRewardList;
	tag: string;
	title: string;
	startTime: string;
	endTime: string;
	topRankReward: APISurvivalMilestoneRewardList;
	maxTopRewardRank: integer;
}

export interface APIGameMode {
	id: integer;
	name: string;
}

export type APIPlayerRankingList = APIList<APIPlayerRanking>;

export interface APIPlayerRanking {
	clan: APIPlayerRankingClan;
	arena?: APIArena;
	tag: string;
	name: string;
	expLevel: integer;
	rank: integer;
	previousRank?: integer;
	trophies: integer;
}

export interface APIVerifyTokenRequest {
	token: string;
}

export interface APIVerifyTokenResponse {
	tag: string;
	token: string;
	status: string;
}

export interface APIClan {
	memberList: APIClanMember[];
	tag: string;
	clanScore: integer;
	clanWarTrophies: integer;
	requiredTrophies: integer;
	donationsPerWeek: integer;
	badgeId: integer;
	clanChestStatus: APIClanChestStatus;
	clanChestLevel: integer;
	clanChestMaxLevel: integer;
	name: string;
	location: APILocation;
	type: APIClanType;
	members: integer;
	description: string;
	clanChestPoints: integer;
}

export enum APIClanChestStatus {
	INACTIVE = "inactive",
	ACTIVE = "active",
	COMPLETED = "completed",
	UNKNOWN = "unknown",
}

export enum APIClanType {
	OPEN = "open",
	INVITE_ONLY = "inviteOnly",
	CLOSED = "closed",
}

export interface APIMatch {
	invites: unknown;
	state: APIMatchState;
	startTime: string;
	battle: APIBattle;
	tag: string;
}

export enum APIMatchState {
	PENDING = "pending",
	CANCELLED = "cancelled",
	TIMED_OUT = "timedOut",
	IN_PROGRESS = "inProgress",
	COMPLETE = "complete",
	FAILED = "failed",
}

export interface APIBattle {
	deckSelection: APIBattleDeckSelection;
	challengeWinCountBefore: integer;
	boatBattleSide: string;
	newTowersDestroyed: integer;
	prevTowersDestroyed: integer;
	remainingTowers: integer;
	boatBattleWon: boolean;
	type: APIBattleType;
	opponent: APIPlayerBattleDataList;
	team: APIPlayerBattleDataList;
	gameMode: APIGameMode;
	arena: APIArena;
	battleTime: string;
	challengeId: integer;
	tournamentTag: string;
	challengeTitle: string;
	isLadderTournament: boolean;
	isHostedMatch: boolean;
}

export enum APIBattleDeckSelection {
	COLLECTION = "collection",
	DRAFT = "draft",
	DRAFT_COMPETITIVE = "draftCompetitive",
	PREDEFINED = "predefined",
	EVENT_DECK = "eventDeck",
	PICK = "pick",
	WARDECK_PICK = "wardeckPick",
	UNKNOWN = "unknown",
}

export enum APIBattleType {
	PVP = "pvp",
	PVE = "pve",
	CLANMATE = "clanmate",
	TOURNAMENT = "tournament",
	FRIENDLY = "friendly",
	SURVIVAL = "survival",
	PVP2v2 = "pvp2v2",
	CLANMATE2v2 = "clanmate2v2",
	CHALLENGE2v2 = "challenge2v2",
	CLANWAR_COLLECTION_DAY = "clanwarCollectionDay",
	CLANWAR_WAR_DAY = "clanwarWarDay",
	CASUAL_1V1 = "casual1v1",
	CASUAL_2V2 = "casual2v2",
	BOAT_BATTLE = "boatBattle",
	BOAT_BATTLE_PRACTICE = "boatBattlePractice",
	RIVER_RACE_PVP = "riverRacePvp",
	RIVER_RACE_DUEL = "riverRaceDuel",
	RIVER_RACE_DUEL_COLOSSEUM = "riverRaceDuelColosseum",
	UNKNOWN = "unknown",
}

export type APIPlayerBattleDataList = APIPlayerBattleData[];

export interface APIPlayerBattleData {
	clan?: APIPlayerClan;
	cards: APIPlayerItemLevelList;
	tag: string;
	name: string;
	startingTrophies?: integer;
	trophyChange?: integer;
	crowns?: integer;
	kingTowerHitPoints?: integer;
	princessTowersHitPoints?: APIIntegerList;
}

export type APIIntegerList = integer[];

export type APIPlayerItemLevelList = APIPlayerItemLevel[];

export interface APIPlayerItemLevel {
	id: integer;
	count?: integer;
	level: integer;
	starLevel?: integer;
	name: string;
	maxLevel: integer;
	iconUrls: {
		large?: string;
		medium: string;
	};
}

export interface APIPlayerClan {
	badgeId: integer;
	tag: string;
	name: string;
}

export interface APICancelMatchResponse {
	success: boolean;
}

export type APIBattleList = APIBattle[];

export interface APICurrentClanWar {
	state: APICurrentClanWarState;
	clan: APIClanWarClan;
	participants: APIClanWarParticipantList;
	clans: APIClanWarClanList;
	collectionEndTime: string;
	warEndTime: string;
}

export enum APICurrentClanWarState {
	CLAN_NOT_FOUND = "clanNotFound",
	ACCESS_DENIED = "accessDenied",
	NOT_IN_WAR = "notInWar",
	COLLECTION_DAY = "collectionDay",
	MATCHMAKING = "matchmaking",
	WAR_DAY = "warDay",
	ENDED = "ended",
}

export type APIClanWarClanList = APIClanWarClan[];

export interface APIClanWarClan {
	tag: string;
	clanScore: integer;
	badgeId: integer;
	crowns: integer;
	name: string;
	participants: integer;
	battlesPlayed: integer;
	wins: integer;
}

export type APIClanWarParticipantList = APIClanWarParticipant[];

export interface APIClanWarParticipant {
	tag: string;
	name: string;
	cardsEarned: integer;
	battlesPlayed: integer;
	wins: integer;
	collectionDayBattlesPlayed: integer;
	numberOfBattles: integer;
}

export type APIRiverRaceLog = APIList<APIRiverRaceLogEntry>;

export interface APIRiverRaceLogEntry {
	standings: APIRiverRaceStandingList;
	seasonId: integer;
	createdDate: string;
	sectionIndex: integer;
}

export type APIRiverRaceStandingList = APIRiverRaceStanding[];

export interface APIRiverRaceStanding {
	rank: integer;
	trophyChange: integer;
	clan: APIRiverRaceClan;
}

export interface APITournament {
	membersList: APITournamentMemberList;
	status: APITournamentStatus;
	preparationDuration: integer;
	createdTime: string;
	startedTime: string;
	endedTime: string;
	firstPlaceCardPrize: integer;
	gameMode: Omit<APIGameMode, "name">;
	type: APITournamentType;
	duration: integer;
	tag: string;
	creatorTag: string;
	name: string;
	description: string;
	capacity: integer;
	maxCapacity: integer;
	levelCap: integer;
}

export enum APITournamentStatus {
	IN_PREPARATION = "inPreparation",
	IN_PROGRESS = "inProgress",
	ENDED = "ended",
	UNKNOWN = "unknown",
}

export enum APITournamentType {
	OPEN = "open",
	PASSWORD_PROTECTED = "passwordProtected",
	UNKNOWN = "unknown",
}

export type APITournamentMemberList = APITournamentMember[];

export interface APITournamentMember {
	rank: integer;
	clan: APIPlayerClan;
	previousRank?: integer;
	tag: string;
	name: string;
	score: integer;
}

export type APITournamentHeaderList = APIList<APITournamentHeader>;

export interface APITournamentHeader {
	status: APITournamentHeaderStatus;
	preparationDuration: integer;
	createdTime: string;
	firstPlaceCardPrize: integer;
	gameMode: Omit<APIGameMode, "name">;
	type: APITournamentHeaderType;
	duration: integer;
	tag: string;
	creatorTag: string;
	name: string;
	description: string;
	capacity: integer;
	maxCapacity: integer;
	levelCap: integer;
}

export enum APITournamentHeaderStatus {
	IN_PREPARATION = "inPreparation",
	IN_PROGRESS = "inProgress",
	ENDED = "ended",
	UNKNOWN = "unknown",
}

export enum APITournamentHeaderType {
	OPEN = "open",
	PASSWORD_PROTECTED = "passwordProtected",
	UNKNOWN = "unknown",
}

export type APIClanList = APIList<APIClan>;

export type APIClanRankingList = APIList<APIClanRanking>;

export interface APIClanRanking {
	clanScore: integer;
	badgeId: integer;
	location: APILocation;
	members: integer;
	tag: string;
	name: string;
	rank: integer;
	previousRank: integer;
}

export interface APIRegisterMatchRequest {
	playerTags: APIStringList;
	gameMode: APIRegisterMatchRequestGameMode;
}

export type APIStringList = string[];

export enum APIRegisterMatchRequestGameMode {
	REGULAR = "regular",
	TEAM_VS_TEAM = "teamVsTeam",
	DOUBLE_ELIXIR_TOURNAMENT = "doubleElixirTournament",
	TRIPLE_ELIXIR_TOURNAMENT = "tripleElixirTournament",
	RAGE = "rage",
	SUDDEN_DEATH = "suddenDeath",
	TOUCHDOWN = "touchdown",
	RAMP_UP = "rampUp",
	DRAFT = "draft",
	MIRROR = "mirror",
	DRAGON_HUNT = "dragonHunt",
}

export interface APIRegisterMatchResponse {
	tag: string;
}

export interface APIUpcomingChests {
	items: APIChestList;
}

export type APIChestList = APIChest[];

export interface APIChest {
	name: string;
	index: integer;
}

export type APIClanWarLog = APIClanWarLogEntry[];

export interface APIClanWarLogEntry {
	standings: APIClanWarStandingList;
	seasonId: integer;
	participants: APIClanWarParticipantList;
	createdDate: string;
}

export type APIClanWarStandingList = APIClanWarStanding[];

export interface APIClanWarStanding {
	trophyChange: integer;
	clan: APIClanWarClan;
}

export interface APIPlayer {
	clan?: APIPlayerClan;
	cards: APIPlayerItemLevelList;
	currentFavouriteCard?: APIItem;
	badges: APIPlayerAchievementBadgeList;
	arena: APIArena;
	role: APIPlayerRole;
	wins: integer;
	losses: integer;
	totalDonations: integer;
	leagueStatistics?: APIPlayerLeagueStatistics;
	tag: string;
	name: string;
	expLevel: integer;
	trophies: integer;
	bestTrophies: integer;
	donations: integer;
	donationsReceived: integer;
	achievements: APIPlayerAchievementProgressList;
	battleCount: integer;
	threeCrownWins: integer;
	challengeCardsWon: integer;
	challengeMaxWins: integer;
	tournamentCardsWon: integer;
	tournamentBattleCount: integer;
	currentDeck: APIPlayerItemLevelList;
	warDayWins: integer;
	clanCardsCollected: integer;
	starPoints?: integer;
	expPoints: integer;
}

export enum APIPlayerRole {
	NOT_MEMBER = "notMember",
	MEMBER = "member",
	LEADER = "leader",
	ADMIN = "admin",
	COLEADER = "coLeader",
}

export type APIPlayerAchievementProgressList = APIPlayerAchievementProgress[];

export interface APIPlayerAchievementProgress {
	stars: integer;
	value: integer;
	name: string;
	target: integer;
	info: string;
	completionInfo: string | null;
}

export interface APIPlayerLeagueStatistics {
	currentSeason: APILeagueSeasonResult;
	bestSeason: APILeagueSeasonResult;
	previousSeason: APILeagueSeasonResult;
}

export interface APILeagueSeasonResult {
	trophies: integer;
	bestTrophies?: integer;
	rank?: integer;
	id?: string;
}

export type APIPlayerAchievementBadgeList = APIPlayerAchievementBadge[];

export interface APIPlayerAchievementBadge {
	iconUrls: {
		large: string;
	};
	maxLevel: integer;
	progress: integer;
	target: integer;
	level: integer;
	name: string;
}

export type APIItemList = APIList<APIItem>;

export interface APIClientError {
	reason: string;
	message?: string;
	type?: string;
	detail?: unknown;
}

export interface APIList<T> {
	items: T[];
	paging?: APIPaging;
}

export interface APIPaging {
	cursors: APICursors;
}

interface APICursors {
	after?: string;
	before?: string;
}

export enum APIRiverRacePeriodType {
	TRAINING = "training",
	WAR_DAY = "warDay",
	COLOSSEUM = "colosseum",
}

export enum APIRiverRaceState {
	CLAN_NOT_FOUND = "clanNotFound",
	ACCESS_DENIED = "accessDenied",
	MATCHMAKING = "matchmaking",
	MATCHED = "matched",
	FULL = "full",
	ENDED = "ended",
}
