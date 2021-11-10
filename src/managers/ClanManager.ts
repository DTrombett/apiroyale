import type ClientRoyale from "..";
import type { APIClan, APITag, FetchOptions } from "..";
import { Clan } from "../structures";
import FetchableManager from "./FetchableManager";

/**
 * A manager for clans
 */
export class ClanManager extends FetchableManager<typeof Clan> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIClan[]) {
		super(client, Clan, data);
	}

	/**
	 * Adds a clan to this manager.
	 * @param data - The data of the clan to add
	 * @returns The added clan
	 */
	add(data: APIClan): Clan {
		return super.add(data);
	}

	/**
	 * Fetches a clan from the API.
	 * @param tag - The tag of the clan to fetch
	 * @param options - The options for the fetch
	 */
	fetch(tag: APITag, options?: FetchOptions): Promise<Clan> {
		return super.fetch(tag, options);
	}

	/**
	 * Removes a clan from this manager.
	 * @param id - The id of the clan to remove
	 * @returns The removed clan, if it exists
	 */
	remove(tag: APITag): Clan | undefined {
		return super.remove(tag);
	}
}

export default ClanManager;
