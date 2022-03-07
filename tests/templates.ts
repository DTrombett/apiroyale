import type {
	APIAchievement,
	APIArena,
	APIBadge,
	APIBestSeason,
	APIClan,
	APIClanMember,
	APIClanMemberList,
	APIClanWeekStanding,
	APICurrentSeason,
	APIDate,
	APILeagueStatistics,
	APILocation,
	APIPaging,
	APIPlayer,
	APIPlayerCard,
	APIPreviousSeason,
	APIRiverRaceLog,
	APIRiverRaceLogEntry,
	APIRiverRaceParticipant,
	APITag,
	APIUpcomingChest,
	APIUpcomingChestName,
	APIUpcomingChests,
	Token,
} from "../src";

export const exampleToken: Token = "to.ke.n";
export const exampleDate: APIDate = "19691231T235959.000Z";
export const exampleTag: APITag = "#0";
export const examplePaging: APIPaging = {
	cursors: { before: "before", after: "after" },
};
export const exampleLocation: APILocation = {
	id: 1,
	isCountry: false,
	name: "location",
};
export const exampleArena: APIArena = { id: 1, name: "arena" };
export const exampleUpcomingChestName: APIUpcomingChestName = "Silver Chest";
export const exampleBestSeason: APIBestSeason = { id: "0000-00", trophies: 0 };
export const exampleCurrentSeason: APICurrentSeason = {
	trophies: 0,
	bestTrophies: 0,
};
export const examplePreviousSeason: APIPreviousSeason = {
	id: "0000-00",
	trophies: 0,
	bestTrophies: 0,
};
export const exampleAchievement: APIAchievement = {
	completionInfo: null,
	info: "info",
	name: "name",
	stars: 1,
	target: 1,
	value: 1,
};
export const exampleBadge: APIBadge = {
	level: 1,
	name: "name",
	maxLevel: 1,
	progress: 1,
	target: 1,
};
export const examplePlayerCard: APIPlayerCard = {
	count: 1,
	id: 1,
	level: 1,
	name: "name",
	maxLevel: 14,
	iconUrls: {
		medium: `https://api-assets.clashroyale.com/cards/1/name.png`,
	},
};
export const exampleLeagueStatistics: APILeagueStatistics = {
	bestSeason: exampleBestSeason,
	currentSeason: exampleCurrentSeason,
	previousSeason: examplePreviousSeason,
};
export const exampleUpcomingChest: APIUpcomingChest = {
	index: 0,
	name: exampleUpcomingChestName,
};
export const exampleRiverRaceParticipant: APIRiverRaceParticipant = {
	boatAttacks: 0,
	decksUsed: 0,
	decksUsedToday: 0,
	fame: 0,
	name: "",
	repairPoints: 0,
	tag: exampleTag,
};
export const exampleAPIClanWeekStanding: APIClanWeekStanding = {
	badgeId: 0,
	clanScore: 0,
	fame: 0,
	finishTime: exampleDate,
	name: "",
	participants: [exampleRiverRaceParticipant],
	periodPoints: 0,
	repairPoints: 0,
	tag: exampleTag,
};
export const exampleRiverRaceLogEntry: APIRiverRaceLogEntry = {
	createdDate: exampleDate,
	seasonId: 1,
	sectionIndex: 0,
	standings: [{ clan: exampleAPIClanWeekStanding, rank: 1, trophyChange: 0 }],
};
export const exampleRiverRaceLog: APIRiverRaceLog = {
	items: [exampleRiverRaceLogEntry],
	paging: examplePaging,
};
export const exampleClanMember: APIClanMember = {
	tag: exampleTag,
	name: "",
	role: "member",
	expLevel: 1,
	trophies: 0,
	arena: exampleArena,
	donations: 0,
	donationsReceived: 0,
	lastSeen: exampleDate,
	clanRank: 1,
	previousClanRank: 1,
	clanChestPoints: 0,
};
export const exampleClan: APIClan = {
	tag: "#0000",
	badgeId: 0,
	name: "",
	type: "open",
	location: exampleLocation,
	description: "",
	clanScore: 0,
	members: 1,
	clanChestLevel: 1,
	clanChestMaxLevel: 0,
	clanChestStatus: "inactive",
	requiredTrophies: 0,
	donationsPerWeek: 0,
	clanWarTrophies: 0,
	memberList: [exampleClanMember],
};
export const exampleUpcomingChests: APIUpcomingChests = {
	items: [exampleUpcomingChest],
};
export const examplePlayer: APIPlayer = {
	tag: exampleTag,
	name: "",
	trophies: 0,
	arena: exampleArena,
	achievements: [exampleAchievement],
	expLevel: 1,
	leagueStatistics: exampleLeagueStatistics,
	badges: [exampleBadge],
	donations: 0,
	donationsReceived: 0,
	clan: exampleClan,
	battleCount: 0,
	wins: 0,
	losses: 0,
	bestTrophies: 0,
	warDayWins: 0,
	cards: [examplePlayerCard],
	challengeCardsWon: 0,
	challengeMaxWins: 0,
	tournamentCardsWon: 0,
	clanCardsCollected: 0,
	currentDeck: [examplePlayerCard],
	expPoints: 0,
	totalDonations: 0,
	role: "member",
	threeCrownWins: 0,
	tournamentBattleCount: 0,
	starPoints: 0,
};
export const exampleClanMemberList: APIClanMemberList = {
	items: [exampleClanMember],
	paging: examplePaging,
};
