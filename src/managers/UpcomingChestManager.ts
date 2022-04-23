import type ClientRoyale from "..";
import type { APIChest } from "..";
import { UpcomingChest } from "../structures";
import type { FetchPlayerUpcomingChestsOptions } from "../util";
import Manager from "./Manager";

/**
 * A manager for upcoming chests
 */
export class UpcomingChestManager extends Manager<typeof UpcomingChest> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param player - The player this manager is for
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIChest[]) {
		super(client, UpcomingChest, {
			addEvent: "newUpcomingChest",
			data,
			removeEvent: "upcomingChestRemove",
			sortMethod: (a, b) => a.index - b.index,
			updateEvent: "upcomingChestUpdate",
		});
	}

	/**
	 * Fetch the upcoming chests of the player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched upcoming chests
	 */
	async fetch(options: FetchPlayerUpcomingChestsOptions): Promise<this> {
		return this.client.fetchPlayerUpcomingChests<this>(options);
	}
}

export default UpcomingChestManager;
