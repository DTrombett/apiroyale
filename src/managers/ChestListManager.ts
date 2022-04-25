import type ClientRoyale from "..";
import type { APIChestList, FetchOptions } from "..";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for chest lists
 */
export class ChestListManager extends Manager<string, APIChestList> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "chestListAdd",
			updateEvent: "chestListUpdate",
			removeEvent: "chestListRemove",
		});
	}

	/**
	 * Get list of reward chests that the player will receive next in the game.
	 * @param playerTag - Tag of the player
	 * @param options - Options for the request
	 * @returns The upcoming chests
	 */
	async fetch(
		playerTag: string,
		options: FetchOptions = {}
	): Promise<APIChestList> {
		const existing = this.get(playerTag);

		if (existing && options.force !== true && !this.isOutdated(playerTag))
			return existing;
		const list = await this.client.api.get(Routes.UpcomingChests(playerTag));

		return this.add(playerTag, list.data.items, {
			maxAge: list.maxAge,
		});
	}
}

export default ChestListManager;
