import type ClientRoyale from "..";
import type { APIBadge, Player } from "..";
import { PlayerBadge } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player badges
 */
export class PlayerBadgeManager extends Manager<typeof PlayerBadge> {
	/**
	 * The player that this manager belongs to
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this manager
	 * @param player - The player that this manager belongs to
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIBadge[]) {
		super(
			client,
			PlayerBadge,
			{
				addEvent: "newBadge",
				data,
				removeEvent: "badgeRemove",
				updateEvent: "badgeUpdate",
			},
			player
		);

		this.player = player;
	}
}

export default PlayerBadgeManager;
