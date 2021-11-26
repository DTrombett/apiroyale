import type { APIRiverRaceLog, Clan, FetchRiverRaceLogOptions } from "..";
import { FinishedRiverRace } from "../structures";
import List from "./List";

/**
 * Manage a river race log
 */
export class RiverRaceLogResults extends List<number, FinishedRiverRace> {
	/**
	 * @param clan - The clan that instantiated this log
	 * @param options - The options used to get these results
	 * @param data - The results provided by the API
	 */
	constructor(
		clan: Clan,
		options: FetchRiverRaceLogOptions,
		data: APIRiverRaceLog
	) {
		super(
			clan.client,
			clan.fetchRiverRaceLog.bind(clan),
			options,
			data.paging,
			data.items.map((value) => [
				value.seasonId,
				new FinishedRiverRace(clan.client, value),
			])
		);
	}
}
