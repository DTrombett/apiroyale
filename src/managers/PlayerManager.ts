import type { APIPlayer, ClientRoyale } from "..";
import { Player } from "../structures";
import { Routes } from "../util";
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
		super(client, Player, {
			addEvent: "newPlayer",
			data,
			removeEvent: "playerRemove",
			route: Routes.Player,
			sortMethod: (a, b) => b.trophies - a.trophies,
			updateEvent: "playerUpdate",
		});
	}
}

export default PlayerManager;
