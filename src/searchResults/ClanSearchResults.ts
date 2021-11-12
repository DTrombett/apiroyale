import type { APIClanSearchResults, ClanManager, SearchClanOptions } from "..";
import { Clan } from "../structures";
import SearchResults from "./SearchResults";

export class ClanSearchResults extends SearchResults<ClanManager> {
	constructor(
		manager: ClanManager,
		options: SearchClanOptions,
		data: APIClanSearchResults
	) {
		super(manager, Clan, options, data);
	}
}

export default ClanSearchResults;
