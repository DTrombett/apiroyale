import type ClientRoyale from "..";
import type { APICard, FetchOptions } from "..";
import { Card } from "../structures";
import Constants, { Routes } from "../util";
import Manager from "./Manager";

/**
 * A manager for cards
 */
export class CardManager extends Manager<typeof Card> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APICard[]) {
		super(client, Card, {
			addEvent: "newCard",
			data,
			removeEvent: "cardRemove",
			updateEvent: "cardUpdate",
		});
	}

	/**
	 * Fetch all the cards.
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

		this.overrideItems(await this.client.api.get<APICard[]>(Routes.Cards()));
		return this;
	}
}

export default CardManager;
