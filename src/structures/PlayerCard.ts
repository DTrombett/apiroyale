import type { APICard, APIPlayerCard, Player } from "..";
import type ClientRoyale from "..";
import { Card } from "./Card";

/**
 * A player card
 */
export class PlayerCard extends Card {
	/**
	 * The amount of cards in the player card
	 */
	count: number;

	/**
	 * The level of the card
	 */
	level: number;

	/**
	 * The star level of the card
	 */
	starLevel: number | undefined;

	/**
	 * The player that owns this card
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this card
	 * @param data - The data of the card
	 */
	constructor(client: ClientRoyale, data: APIPlayerCard, player: Player) {
		super(client, data);

		this.player = player;
		this.count = data.count;
		this.level = data.level;
		this.starLevel = data.starLevel;
	}

	/**
	 * Clone this card.
	 */
	clone<T extends Card>(): T;
	clone(): PlayerCard {
		return new PlayerCard(this.client, this.toJson(), this.player);
	}

	/**
	 * Checks whether this card is equal to another, comparing all properties.
	 * @param card - The card to compare to
	 */
	equals(card: PlayerCard): boolean {
		return (
			super.equals(card) &&
			this.count === card.count &&
			this.level === card.level &&
			this.starLevel === card.starLevel
		);
	}

	/**
	 * Patch this card.
	 * @param data - The data to patch
	 * @returns The patched card
	 */
	patch(data: Partial<APIPlayerCard>): this {
		const old = this.clone<PlayerCard>();
		super.patch(data);

		if (data.count != null) this.count = data.count;
		if (data.level != null) this.level = data.level;
		if (data.starLevel != null) this.starLevel = data.starLevel;

		if (!this.equals(old)) this.client.emit("cardUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this card.
	 */
	toJson<R extends APICard = APIPlayerCard>(): R;
	toJson(): APIPlayerCard {
		return {
			...super.toJson(),
			count: this.count,
			level: this.level,
			starLevel: this.starLevel,
		};
	}
}

export default PlayerCard;
