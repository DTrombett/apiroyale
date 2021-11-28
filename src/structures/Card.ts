import type ClientRoyale from "..";
import type { APICard, StringId } from "..";
import { isEqual } from "../util";
import Structure from "./Structure";

/**
 * A card
 */
export class Card<T extends APICard = APICard> extends Structure<T> {
	/**
	 * The icon urls of the card
	 */
	readonly iconUrls!: APICard["iconUrls"];

	/**
	 * The id of this arena
	 */
	readonly id!: StringId;

	/**
	 * The maximum level of this card
	 */
	maxLevel!: number;

	/**
	 * The name of the card
	 */
	name!: string;

	/**
	 * @param client - The client that instantiated this card
	 * @param data - The data of the card
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.id}`);
		this.patch({
			...data,
			id: undefined,
		});
	}

	/**
	 * Clone this card.
	 * @returns The cloned card
	 */
	clone(): Card<T> {
		return new Card(this.client, this.toJson());
	}

	/**
	 * Check whether this card is equal to another card.
	 * @param card - The card to compare to
	 * @returns Whether the cards are equal
	 */
	equals(card: Card<T>): card is this {
		return (
			super.equals(card) &&
			isEqual(this.iconUrls, card.iconUrls) &&
			this.id === card.id &&
			this.maxLevel === card.maxLevel &&
			this.name === card.name
		);
	}

	/**
	 * Patch this card.
	 * @param data - The data to patch this card with
	 * @returns The patched card
	 */
	patch(data: Partial<T>): this {
		if (data.iconUrls?.medium !== undefined)
			this.iconUrls.medium = data.iconUrls.medium;
		if (data.maxLevel !== undefined) this.maxLevel = data.maxLevel;
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this card.
	 * @returns The card's data
	 */
	toJson(): APICard {
		return {
			...super.toJson(),
			iconUrls: this.iconUrls,
			id: Number(this.id),
			maxLevel: this.maxLevel,
			name: this.name,
		};
	}
}

export default Card;
