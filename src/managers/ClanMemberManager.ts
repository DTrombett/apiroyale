import type ClientRoyale from "..";
import type { APIClanMember, Clan, FetchOptions, Path } from "..";
import { ClanMember } from "../structures";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends Manager<typeof ClanMember> {
	/**
	 * The clan this manager is for
	 */
	readonly clan: Clan;

	/**
	 * @param client - The client that instantiated this manager
	 * @param clan - The clan this manager is for
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, clan: Clan, data?: APIClanMember[]) {
		super(
			client,
			ClanMember,
			{
				addEvent: "newClanMember",
				data,
				removeEvent: "clanMemberRemove",
				sortMethod: (a, b) => b.trophies - a.trophies,
				updateEvent: "clanMemberUpdate",
			},
			clan
		);

		this.clan = clan;
	}

	/**
	 * The path to fetch the members from
	 */
	get path(): Path {
		return Routes.ClanMembers(this.clan.tag) as Path;
	}

	/**
	 * Fetch the members of the clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched members
	 */
	async fetch({ force = false }: FetchOptions = {}): Promise<this> {
		if (
			!force &&
			Date.now() - this.clan.lastUpdate.getTime() < this.client.structureMaxAge
		)
			return Promise.resolve(this);
		return this.client.api
			.get<APIClanMember[]>(this.path)
			.then((memberList) => this.clan.patch({ memberList }))
			.then(() => this);
	}
}

export default ClanMemberManager;
