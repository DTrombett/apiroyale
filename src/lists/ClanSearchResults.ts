import type {
	APIClanSearchResults,
	APITag,
	ClanManager,
	ClanResultPreview,
	SearchClanOptions,
} from "..";
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
			data.items.map((result) => {
				const clan =
					manager.client.clanResultPreviews.add<ClanResultPreview>(result);

				return [clan.id, clan];
			})
		);
	}
}

export default ClanSearchResults;
