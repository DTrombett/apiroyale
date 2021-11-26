import type { APIPlayer, ClientRoyale } from "..";
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
		super(client, Player, {
			addEvent: "newPlayer",
			data,
			removeEvent: "playerRemoved",
		});
	}
}

export default PlayerManager;
