import type ClientRoyale from "..";
import type { APIClanMember, Clan, FetchOptions, Path } from "..";
import Manager from "../managers";
import { ClanMember } from "../structures";
import Constants from "../util";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends Manager<typeof ClanMember> {
	/**
	 * The route to fetch the members from
	 */
	static route = `/clans/:id/members` as const;

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
				removeEvent: "clanMemberRemoved",
			},
			clan
		);

		this.clan = clan;
	}

	/**
	 * The path to fetch the members from
	 */
	get path(): Path {
		return ClanMemberManager.route.replace(":id", this.clan.tag) as Path;
	}

	/**
	 * Fetches the members of the clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched members
	 */
	async fetch({
		force = false,
		maxAge = Constants.defaultMaxAge,
	}: FetchOptions = {}): Promise<this> {
		if (!force && Date.now() - this.clan.lastUpdate.getTime() < maxAge)
			return Promise.resolve(this);
		return this.client.api
			.get<APIClanMember[]>(this.path)
			.then((memberList) => this.clan.patch({ memberList }))
			.then(() => this);
	}
}

export default ClanMemberManager;
