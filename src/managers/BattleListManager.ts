import type ClientRoyale from "..";
import type { APIBattleList, FetchOptions } from "..";
import type { StructureOptions } from "../util";
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

	add<T extends APIBattleList>(
		key: string,
		value: T,
		options?: StructureOptions
	): T {
		if (options?.cacheNested ?? this.client.defaults.defaultCacheNested)
			for (const battle of value) {
				this.client.gameModes.add(battle.gameMode.id, battle.gameMode, options);
				this.client.arenas.add(battle.arena.id, battle.arena, options);
			}
		return super.add(key, value, options);
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

		if (existing && options.force !== true && !this.isOutdated(playerTag))
			return existing;
		const list = await this.client.api.get(Routes.BattleLog(playerTag));

		return this.add(playerTag, list.data, {
			maxAge: list.maxAge,
		});
	}
}

export default BattleListManager;
