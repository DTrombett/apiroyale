import type { APIPlayerCard, Path } from "..";
import type ClientRoyale from "..";
import { PlayerCard } from "../structures";
import CardManager from "./CardManager";

/**
 * A manager for player cards
 */
export class PlayerCardManager extends CardManager<typeof PlayerCard> {
	static route: Path = "/";

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIPlayerCard[]) {
		super(client, PlayerCard, data);
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
	 * * **NOTE: You can't fetch player cards from the API, only global cards are fetchable so this will always throw an error**
	 * @throw You can't fetch player cards from the API, only global cards are fetchable
	 */
	fetch(): never {
		throw new Error(
			"You can't fetch player cards from the API, only global cards are fetchable"
		);
	}
}
