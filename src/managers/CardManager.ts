import type ClientRoyale from "..";
import type { FetchOptions } from "..";
import { Card } from "../structures";
import type { Path, StructureType } from "../util";
import Constants, { average } from "../util";
import Manager from "./Manager";

/**
 * A manager for cards
 */
export class CardManager<
	T extends typeof Card = typeof Card
> extends Manager<T> {
	/**
	 * The route to fetch the cards from
	 */
	static route: Path = "/cards";

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, structure?: T, data?: StructureType<T>[]) {
		super(client, (structure ?? Card) as T, data);
	}

	/**
	 * Gets the path to fetch the cards from
	 * @returns The path to fetch the cards from
	 */
	static path(): Path {
		return this.route;
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
			Date.now() - average(this.map((card) => card.lastUpdate.getTime())) <
				maxAge
		)
			return Promise.resolve(this);
		return this.client.api
			.get<StructureType<T>[]>(CardManager.path())
			.then((cards) => {
				this.clear();
				for (const card of cards) this.add(card);
			})
			.then(() => this);
	}
}

export default CardManager;
