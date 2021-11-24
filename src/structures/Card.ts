import type ClientRoyale from "..";
import type { APICard, StringId } from "..";
import { isEqual } from "../util";
import Structure from "./Structure";

/**
 * A card
 */
export class Card<T extends APICard = APICard> extends Structure<T> {
	static id = "id" as const;

	/**
	 * The icon urls of the card
	 */
	iconUrls!: APICard["iconUrls"];

	/**
	 * The id of this arena
	 */
	readonly id: StringId;

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
		super(client, data);

		this.id = data.id.toString() as StringId;
		this.patch(data);
	}

	/**
	 * Clone this card.
	 * @returns The cloned card
	 */
	clone(): Card<T> {
		return new Card(this.client, this.toJson());
	}

	/**
	 * Checks whether this card is equal to another.
	 * @param card - The card to compare to
	 * @returns Whether the cards are equal
	 */
	equals(card: Card<T>): boolean {
		return (
			super.equals(card) &&
			this.name === card.name &&
			isEqual(this.iconUrls, card.iconUrls) &&
			this.maxLevel === card.maxLevel &&
			this.id === card.id
		);
	}

	/**
	 * Patch this card.
	 * @param data - The data to patch
	 * @returns The patched card
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.iconUrls !== undefined) this.iconUrls = data.iconUrls;
		if (data.maxLevel !== undefined) this.maxLevel = data.maxLevel;
		if (data.name !== undefined) this.name = data.name;

		if (!this.equals(old)) this.client.emit("cardUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this card.
	 * @returns The card's data
	 */
	toJson(): APICard {
		return {
			name: this.name,
			iconUrls: this.iconUrls,
			id: Number(this.id),
			maxLevel: this.maxLevel,
		};
	}

	/**
	 * Gets a string representation of this card.
	 * @returns The card's name
	 */
	toString(): string {
		return this.name;
	}
}

export default Card;
