import type {
	APIRiverRaceLog,
	ClientRoyale,
	FetchRiverRaceLogOptions,
	ListMethod,
} from "..";
import { FinishedRiverRace } from "../structures";
import List from "./List";

/**
 * Manage a river race log
 */
export class RiverRaceLogResults extends List<number, FinishedRiverRace> {
	/**
	 * @param client - The client that instantiated this list
	 * @param options - The options used to get these results
	 * @param data - The results provided by the API
	 */
	constructor(
		client: ClientRoyale,
		options: FetchRiverRaceLogOptions,
		data: APIRiverRaceLog
	) {
		super(
			client,
			client.fetchRiverRaceLog.bind(client) as ListMethod<
				number,
				FinishedRiverRace
			>,
			options,
			data.paging,
			data.items.map((value) => [
				value.seasonId,
				new FinishedRiverRace(client, value),
			])
		);
	}
}
