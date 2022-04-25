import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type { APIItem, APIItemList, ListOptions } from "..";
import { Manager } from "./Manager";

/**
 * A manager for items
 */
export class ItemManager extends Manager<APIItem["id"], APIItem> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIItem[]) {
		super(
			client,
			{
				addEvent: "itemAdd",
				removeEvent: "itemRemove",
				updateEvent: "itemUpdate",
			},
			...data.map((item) => [item.id, item] as const)
		);
	}

	/**
	 * Get list of available cards.
	 * @param options - Options for the request
	 * @returns The cards
	 */
	async fetch(options: ListOptions = {}): Promise<APIItemList> {
		const query: Record<string, string> = {};

		if (options.limit !== undefined) query.limit = options.limit.toString();
		if (options.after !== undefined) query.after = options.after;
		if (options.before !== undefined) query.before = options.before;
		const items = await this.client.api.get(Routes.Cards(), {
			query,
		});

		for (const item of items.data.items)
			this.add(item.id, item, { maxAge: items.maxAge });
		return items.data;
	}
}

export default ItemManager;
