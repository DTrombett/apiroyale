import type ClientRoyale from "..";
import type {
	APIRiverRaceLog,
	APIRiverRaceLogEntry,
	Collection,
	ListOptions,
} from "..";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for river race log entries
 */
export class RiverRaceLogEntryManager extends Manager<
	`${string}-${number}-${number}`,
	APIRiverRaceLogEntry
> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "riverRaceLogEntryAdd",
			updateEvent: "riverRaceLogEntryUpdate",
			removeEvent: "riverRaceLogEntryRemove",
		});
	}

	/**
	 * Retrieve clan's river race log.
	 * @param clanTag - Tag of the clan
	 * @param options - Options for the request
	 * @returns The river race log
	 */
	async fetch(
		clanTag: string,
		options: ListOptions = {}
	): Promise<APIRiverRaceLog> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const res = await this.client.api.get(Routes.RiverRaceLog(clanTag), {
			query,
		});

		for (const entry of res.data.items)
			this.add(`${clanTag}-${entry.seasonId}-${entry.sectionIndex}`, entry, {
				maxAge: res.maxAge,
			});
		return res.data;
	}

	/**
	 * Filter the entries for a specific clan from the cache.
	 * @param clanTag - Tag of the
	 * @returns The filtered entries
	 */
	of(
		clanTag: string
	): Collection<`${string}-${number}-${number}`, APIRiverRaceLogEntry> {
		return this.filter((_, key) => key.startsWith(clanTag));
	}
}

export default RiverRaceLogEntryManager;
