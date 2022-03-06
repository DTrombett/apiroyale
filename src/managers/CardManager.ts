import type ClientRoyale from "..";
import type { APICard, FetchOptions } from "..";
import { Card } from "../structures";
import { Routes } from "../util";
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
			sortMethod: (a, b) => a.name.localeCompare(b.name),
			updateEvent: "cardUpdate",
		});
	}

	/**
	 * Fetch all the cards.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched cards
	 */
	async fetch({ force = false }: FetchOptions = {}): Promise<this> {
		if (
			!force &&
			Date.now() - (this.first()?.lastUpdate.getTime() ?? 0) <
				this.client.structureMaxAge
		)
			return Promise.resolve(this);

		this.overrideItems(
			...(await this.client.api.get<APICard[]>(Routes.Cards()))
		);
		return this;
	}
}

export default CardManager;
