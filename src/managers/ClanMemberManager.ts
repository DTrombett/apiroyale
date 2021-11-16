import type ClientRoyale from "..";
import type { APIMember, APITag, Clan, FetchOptions } from "..";
import { Player } from "../structures";
import type { Path } from "../util";
import Constants from "../util";
import Manager from "./Manager";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends Manager<typeof Player> {
	/**
	 * The route to fetch the members from
	 */
	static route: Path = `/clans/:id/members`;

	/**
	 * The clan this manager is for
	 */
	clan: Clan;

	/**
	 * @param client - The client that instantiated this manager
	 * @param clan - The clan this manager is for
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, clan: Clan, data?: APIMember[]) {
		super(client, Player, data);

		this.clan = clan;
	}

	/**
	 * Gets the path to fetch the members from
	 * @param tag - The tag of the clan
	 * @returns The path to fetch the members from
	 */
	static path(tag: APITag): Path {
		return this.route.replace(":id", tag) as Path;
	}

	/**
	 * Fetches the members of this clan.
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
			.get<APIMember[]>(ClanMemberManager.path(this.clan.tag))
			.then((memberList) => this.clan.patch({ memberList }))
			.then(() => this);
	}
}

export default ClanMemberManager;
