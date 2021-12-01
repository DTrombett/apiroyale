import type {
	APIClanSearchResults,
	APITag,
	ClanManager,
	SearchClanOptions,
} from "..";
import { ClanResultPreview } from "../structures";
import List from "./List";

/**
 * Manage clan search results
 */
export class ClanSearchResults extends List<APITag, ClanResultPreview> {
	/**
	 * @param manager - The clan manager that instantiated the search
	 * @param options - The options used to get these results
	 * @param data - The results provided by the API
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
			data.paging,
			data.items.map((result) => [
				result.tag,
				new ClanResultPreview(manager.client, result),
			])
		);
	}
}

export default ClanSearchResults;
