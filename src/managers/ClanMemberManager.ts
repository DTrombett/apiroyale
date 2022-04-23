import type ClientRoyale from "..";
import type {
	APIClanMember,
	Clan,
	ClanPreview,
	ClanResultPreview,
	FetchOptions,
} from "..";
import { ClanMember } from "../structures";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends Manager<typeof ClanMember> {
	/**
	 * The clan tag this manager is for
	 */
	readonly clanTag: string;

	/**
	 * @param client - The client that instantiated this manager
	 * @param clanTag - The clan tag this manager is for
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, clanTag: string, data?: APIClanMember[]) {
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
			clanTag
		);

		this.clanTag = clanTag;
	}

	/**
	 * The clan this manager is for, if cached
	 */
	get clan(): Clan | ClanPreview | ClanResultPreview | null {
		return this.client.allClans.get(this.clanTag) ?? null;
	}

	/**
	 * The path to fetch the members from
	 */
	get path(): Routes["ClanMembers"] {
		return Routes.ClanMembers(this.clanTag);
	}

	/**
	 * Fetch the members of the clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched members
	 */
	async fetch({ force = false }: FetchOptions = {}): Promise<this> {
		const first = this.first();

		if (
			!force &&
			first &&
			Date.now() - first.lastUpdate.getTime() < this.client.structureMaxAge
		)
			return Promise.resolve(this);
		return this.client.api
			.get(this.path)
			.then((memberList) => this.add(...memberList.items));
	}
}

export default ClanMemberManager;
