import type { APIPlayerCard, Path, Player } from "..";
import type ClientRoyale from "..";
import { PlayerCard } from "../structures";
import CardManager from "./CardManager";

/**
 * A manager for player cards
 */
export class PlayerCardManager extends CardManager<typeof PlayerCard> {
	static route: Path = "/";

	/**
	 * The player that this manager belongs to
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIPlayerCard[]) {
		super(client, PlayerCard, data);

		this.player = player;
	}

	/**
	 * * **NOTE: You can't fetch player cards from the API, only global cards are fetchable so this will always throw an error**
	 * @throw You can't fetch player cards from the API, only global cards are fetchable
	 */
	static path(): never {
		throw new Error(
			"You can't fetch player cards from the API, only global cards are fetchable"
		);
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends PlayerCard = PlayerCard>(data: APIPlayerCard): S {
		const existing = this.get(data[PlayerCard.id].toString()) as S | undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new PlayerCard(this.client, data, this.player) as S;
		this.set(achievement.id, achievement);
		this.client.emit("structureAdd", achievement);
		return achievement;
	}

	/**
	 * * **NOTE: You can't fetch player cards from the API, only global cards are fetchable so this will always throw an error**
	 * @throw You can't fetch player cards from the API, only global cards are fetchable
	 */
	fetch(): never {
		throw new Error(
			"You can't fetch player cards from the API, only global cards are fetchable"
		);
	}
}
