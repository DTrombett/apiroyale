import type ClientRoyale from "..";
import type { APIMember, APITag, Clan, FetchOptions, Path } from "..";
import { Manager } from "..";
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
	 * Gets the path to fetch the members from
	 * @param tag - The tag of the clan
	 * @returns The path to fetch the members from
	 */
	static path(tag: APITag): Path {
		return this.route.replace(":id", tag) as Path;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends ClanMember = ClanMember>(data: APIMember): S {
		const existing = this.get(data[ClanMember.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const member = new ClanMember(this.client, data, this.clan) as S;
		this.set(member.id, member);
		this.client.emit("structureAdd", member);
		return member;
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
			.get<APIMember[]>(ClanMemberManager.path(this.clan.tag))
			.then((memberList) => this.clan.patch({ memberList }))
			.then(() => this);
	}
}

export default ClanMemberManager;
