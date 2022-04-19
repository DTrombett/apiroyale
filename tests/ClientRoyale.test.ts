import ClientRoyale, {
	Clan,
	ClanMemberList,
	Collection,
	Errors,
	Player,
	Rest,
	RiverRaceLogResults,
	UpcomingChestManager,
} from "../src";
import {
	exampleClan,
	exampleClanMemberList,
	examplePlayer,
	exampleRiverRaceLog,
	exampleTag,
	exampleToken,
	exampleUpcomingChests,
} from "./templates";

const mockedGet = jest.spyOn(Rest.prototype, "get");

test("test ClientRoyale class", async () => {
	expect(() => new ClientRoyale()).toThrow(Errors.tokenMissing());
	expect(
		() => new ClientRoyale({ abortTimeout: -1, structureMaxAge: -1 })
	).toThrow();
	expect(() => new ClientRoyale({ token: exampleToken })).not.toThrow();
	const client = new ClientRoyale({
		abortTimeout: 1000,
		baseURL: "http://example.com",
		structureMaxAge: 1000,
		token: exampleToken,
	});
	expect(client.abortTimeout).toBe(1000);
	expect(client.baseURL).toBe("http://example.com");
	expect(client.structureMaxAge).toBe(1000);
	expect(client.token).toBe(exampleToken);
	client.clans.set(exampleTag, new Clan(client, exampleClan));
	expect(client.allClans).toBeInstanceOf(Collection);
	expect(client.allClans.size).toBe(1);
	expect(client.allPlayers).toBeInstanceOf(Collection);
	expect(client.allPlayers.size).toBe(1);

	mockedGet.mockResolvedValue(exampleRiverRaceLog);
	await expect(
		client.fetchRiverRaceLog({
			tag: exampleTag,
			after: "after",
			before: "before",
			limit: 10,
		})
	).resolves.toBeInstanceOf(RiverRaceLogResults);
	await expect(
		client.fetchRiverRaceLog({
			tag: exampleTag,
			limit: -1,
		})
	).rejects.toBeInstanceOf(TypeError);

	mockedGet.mockResolvedValue(exampleUpcomingChests);
	await expect(
		client.fetchPlayerUpcomingChests({ tag: exampleTag })
	).resolves.toBeInstanceOf(UpcomingChestManager);
	await expect(
		client.fetchPlayerUpcomingChests({
			tag: exampleTag,
			// @ts-expect-error - See if the validate function works
			force: 1,
		})
	).rejects.toBeInstanceOf(TypeError);
	const player = new Player(client, examplePlayer);
	client.players.set(exampleTag, player);
	await expect(
		client.fetchPlayerUpcomingChests({ tag: exampleTag })
	).resolves.toBeInstanceOf(UpcomingChestManager);
	await expect(
		client.fetchPlayerUpcomingChests({ tag: "#0000", force: true })
	).resolves.toBeInstanceOf(UpcomingChestManager);

	mockedGet.mockResolvedValue(exampleClanMemberList);
	await expect(
		client.fetchClanMembers({
			tag: exampleTag,
			after: "after",
			before: "before",
			limit: 10,
		})
	).resolves.toBeInstanceOf(ClanMemberList);
	await expect(
		client.fetchClanMembers({
			tag: exampleTag,
			limit: -1,
		})
	).rejects.toBeInstanceOf(TypeError);
});
