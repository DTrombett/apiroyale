import type { APIPlayer, APITag, ClientRoyale } from "..";
import type { OnlyPlayer } from "../structures";
import { Player } from "../structures";
import FetchableManager from "./FetchableManager";

/**
 * A manager for players
 */
export class PlayerManager extends FetchableManager<typeof Player> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIPlayer[]) {
		super(client, Player, data);
	}

	/**
	 * Removes a player from this manager.
	 * @param tag - The tag of the player to remove
	 * @returns The removed player, if it exists
	 */
	remove(tag: APITag): OnlyPlayer | undefined {
		return super.remove(tag) as OnlyPlayer | undefined;
	}
}
