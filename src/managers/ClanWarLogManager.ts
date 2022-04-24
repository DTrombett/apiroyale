import type ClientRoyale from "..";
import type { APIClanWarLog, FetchOptions, ListOptions } from "..";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for clan war logs
 */
export class ClanWarLogManager extends Manager<string, APIClanWarLog> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "clanWarLogAdd",
			updateEvent: "clanWarLogUpdate",
		});
	}

	/**
	 * Retrieve clan's clan war log.
	 * @param clanTag - Tag of the clan
	 * @param options - Options for the request
	 * @returns The clan war log
	 */
	async fetch(
		clanTag: string,
		options: FetchOptions & ListOptions = {}
	): Promise<APIClanWarLog> {
		const existing = this.get(clanTag);

		if (
			existing &&
			options.force !== true &&
			(this.maxAges[clanTag] ?? 0) < Date.now()
		)
			return existing;
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const res = await this.client.api.get(Routes.WarLog(clanTag), {
			query,
		});

		return this.add(clanTag, res.data, { maxAge: res.maxAge });
	}
}

export default ClanWarLogManager;
