import type ClientRoyale from "..";
import type { APIBadge, Player } from "..";
import { PlayerBadge } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player badges
 */
export class PlayerBadgeManager extends Manager<typeof PlayerBadge> {
	/**
	 * The player that owns this manager
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIBadge[]) {
		super(client, PlayerBadge, data);

		this.player = player;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends PlayerBadge = PlayerBadge>(data: APIBadge): S {
		const existing = this.get(data[PlayerBadge.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new PlayerBadge(this.client, data, this.player) as S;
		this.set(achievement.id, achievement);
		this.client.emit("structureAdd", achievement);
		return achievement;
	}

	/**
	 * Removes a badge from the manager.
	 * @param name - The name of the badge to remove
	 * @returns The removed badge, if it exists
	 */
	remove(name: string): PlayerBadge | undefined {
		return super.remove(name);
	}
}

export default PlayerBadgeManager;
