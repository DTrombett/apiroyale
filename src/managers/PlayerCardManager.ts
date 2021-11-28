import type ClientRoyale from "..";
import type { APIPlayerCard, Player } from "..";
import { PlayerCard } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player cards
 */
export class PlayerCardManager extends Manager<typeof PlayerCard> {
	/**
	 * The player that this manager belongs to
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this manager
	 * @param player - The player that this manager belongs to
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIPlayerCard[]) {
		super(
			client,
			PlayerCard,
			{
				addEvent: "newPlayerCard",
				data,
				removeEvent: "playerCardRemove",
				updateEvent: "playerCardUpdate",
			},
			player
		);

		this.player = player;
	}
}
