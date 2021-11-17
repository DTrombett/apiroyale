import type ClientRoyale from "..";
import { Player } from "../structures";
import type { APIMember, APITag, Clan, FetchOptions } from "..";
import PlayerManager from "./PlayerManager";
import type { Path } from "../util";
import Constants from "../util";

/**
 * A manager for clan members
 */
export class ClanMemberManager extends PlayerManager {
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
		super(client);

		this.clan = clan;
		if (data) for (const member of data) this.add(member);
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
	add<S extends Player = Player>(data: APIMember): S {
		const existing = this.get(data[Player.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const player = new Player(this.client, data, this.clan) as S;
		this.set(player.id, player);
		this.client.emit("structureAdd", player);
		return player;
	}

	/**
	 * * **Note:** This method is only available on a PlayerManager.
	 * * Use {@link ClanMemberManager#fetchMembers} to fetch the clan members and {@link PlayerManager#fetch} to fetch a player.
	 */
	fetch(): never {
		throw new Error(
			"This method is only available on a PlayerManager. Use fetchMembers to fetch the clan members and PlayerManager#fetch to fetch a player."
		);
	}

	/**
	 * Fetches the members of the clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched members
	 */
	async fetchMembers({
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
