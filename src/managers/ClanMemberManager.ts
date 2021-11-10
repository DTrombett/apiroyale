import type ClientRoyale from "..";
import type { APIMember, Clan, FetchOptions } from "..";
import { ClanMember } from "../structures";
import Defaults from "../util";
import Manager from "./Manager";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends Manager<typeof ClanMember> {
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
		super(client, ClanMember, data);

		this.clan = clan;
	}

	/**
	 * Fetches the members of this clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched members
	 */
	async fetch({
		force = false,
		maxAge = Defaults.maxAge,
	}: FetchOptions = {}): Promise<this> {
		if (!force && Date.now() - this.clan.lastUpdate.getTime() < maxAge)
			return Promise.resolve(this);
		return this.client.api
			.get<APIMember[]>(`/clans/${this.clan.tag}/members`)
			.then((memberList) => this.clan.patch({ memberList }))
			.then(() => this);
	}
}

export default ClanMemberManager;
