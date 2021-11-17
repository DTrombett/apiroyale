import type { APICard } from "..";
import type ClientRoyale from "..";
import Structure from "./Structure";

/**
 * A card
 */
export class Card extends Structure<APICard> {
	static id = "id" as const;

	/**
	 * The name of the card
	 */
	name: string;

	/**
	 * The icon urls of the card
	 */
	iconUrls: APICard["iconUrls"];

	/**
	 * The maximum level of this card
	 */
	maxLevel: number;

	/**
	 * @param client - The client that instantiated this card
	 * @param data - The data of the card
	 */
	constructor(client: ClientRoyale, data: APICard) {
		super(client, data);

		this.iconUrls = data.iconUrls;
		this.id = data.id.toString();
		this.maxLevel = data.maxLevel;
		this.name = data.name;
	}

	/**
	 * Clone this card.
	 */
	clone<T extends Card>(): T;
	clone(): Card {
		return new Card(this.client, this.toJson());
	}

	/**
	 * Checks whether this card is equal to another, comparing all properties.
	 * @param card - The card to compare to
	 */
	equals(card: Card): boolean {
		return (
			this.name === card.name &&
			this.iconUrls.medium === card.iconUrls.medium &&
			this.maxLevel === card.maxLevel &&
			this.id === card.id
		);
	}

	/**
	 * Patch this card.
	 * @param data - The data to patch
	 * @returns The patched card
	 */
	patch(data: Partial<APICard>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name != null) this.name = data.name;
		if (data.iconUrls != null) this.iconUrls = data.iconUrls;
		if (data.maxLevel != null) this.maxLevel = data.maxLevel;
		if (data.name != null) this.name = data.name;

		if (!this.equals(old)) this.client.emit("cardUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this card.
	 */
	toJson<R extends APICard = APICard>(): R;
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
