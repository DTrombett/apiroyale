import type ClientRoyale from "..";
import type { APIBadge } from "..";
import { PlayerBadge } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player badges
 */
export class PlayerBadgeManager extends Manager<typeof PlayerBadge> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIBadge[]) {
		super(client, PlayerBadge, data);
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
