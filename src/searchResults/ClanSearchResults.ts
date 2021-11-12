import type { APIClanSearchResults, ClanManager, SearchClanOptions } from "..";
import type { ClanResultPreview } from "../structures";
import { Clan } from "../structures";
import SearchResults from "./SearchResults";

/**
 * A class to manage clan search results
 */
export class ClanSearchResults extends SearchResults<
	ClanManager,
	ClanResultPreview
> {
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
		super(manager, Clan, options, data);
	}
}

export default ClanSearchResults;
