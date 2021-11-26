import type ClientRoyale from "..";
import type { APICard, FetchOptions, Path } from "..";
import { Card } from "../structures";
import Constants from "../util";
import Manager from "./Manager";

/**
 * A manager for cards
 */
export class CardManager extends Manager<typeof Card> {
	/**
	 * The route to fetch the cards from
	 */
	static route: Path = "/cards";

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APICard[]) {
		super(client, Card, {
			addEvent: "newCard",
			data,
			removeEvent: "cardRemoved",
		});
	}

	/**
	 * Fetches all the cards.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched cards
	 */
	async fetch({
		force = false,
		maxAge = Constants.defaultMaxAge,
	}: FetchOptions = {}): Promise<this> {
		if (
			!force &&
			Date.now() - Math.max(...this.map((card) => card.lastUpdate.getTime())) <
				maxAge
		)
			return Promise.resolve(this);

		const cards = await this.client.api.get<APICard[]>(CardManager.route);
		this.clear();
		for (const card of cards) this.add(card);
		return this;
	}
}

export default CardManager;
