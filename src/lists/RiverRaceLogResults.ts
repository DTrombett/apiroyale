import type { APIRiverRaceLog, Clan, FetchRiverRaceLogOptions } from "..";
import { RiverRace } from "../structures";
import List from "./List";

/**
 * A class to manage a river race log
 */
export class RiverRaceLogResults extends List<number, RiverRace> {
	/**
	 * @param clan - The clan for this log
	 * @param options - The options used to get these results
	 * @param data - The data to create the results from
	 */
	constructor(
		clan: Clan,
		options: FetchRiverRaceLogOptions | undefined,
		data: APIRiverRaceLog
	) {
		super(
			clan.client,
			clan.fetchRiverRaceLog.bind(clan),
			options ?? {},
			data.items.map((value) => [
				value.seasonId,
				new RiverRace(clan.client, value),
			]),
			data.paging
		);
	}
}
