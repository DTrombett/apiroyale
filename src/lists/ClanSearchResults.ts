import type {
	APIClanSearchResults,
	APITag,
	ClanManager,
	SearchClanOptions,
} from "..";
import { Clan } from "../structures";
import List from "./List";

/**
 * A class to manage clan search results
 */
export class ClanSearchResults extends List<APITag, Clan> {
	/**
	 * @param manager - The clan manager for this search
	 * @param options - The options used to get these results
	 * @param data - The data to create the results from
	 */
	constructor(
		manager: ClanManager,
		options: SearchClanOptions,
		data: APIClanSearchResults
	) {
		super(
			manager.client,
			manager.search.bind(manager),
			options,
			data.items.map((result) => [
				result.tag,
				new Clan(manager.client, result),
			]),
			data.paging
		);
	}
}

export default ClanSearchResults;
