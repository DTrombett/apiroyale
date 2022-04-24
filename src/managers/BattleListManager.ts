import type ClientRoyale from "..";
import type { FetchOptions } from "..";
import type { APIBattleList } from "../APITypes";
import { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for battle lists
 */
export class BattleListManager extends Manager<string, APIBattleList> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "battleListAdd",
			updateEvent: "battleListUpdate",
			removeEvent: "battleListRemove",
		});
	}

	/**
	 * Get list of recent battles for a player.
	 * @param playerTag - Tag of the player
	 * @param options - Options for the request
	 * @returns The battle list
	 */
	async fetch(
		playerTag: string,
		options: FetchOptions = {}
	): Promise<APIBattleList> {
		const existing = this.get(playerTag);

		if (existing && options.force !== undefined && !this.isOutdated(playerTag))
			return existing;
		const player = await this.client.api.get(Routes.BattleLog(playerTag));

		return this.add(playerTag, player.data, {
			maxAge: player.maxAge,
		});
	}
}

export default BattleListManager;
