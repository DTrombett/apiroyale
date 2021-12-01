import type { APIPlayerCard, Player } from "..";
import type ClientRoyale from "..";
import { Card } from "./Card";

/**
 * A player card
 */
export class PlayerCard<
	T extends APIPlayerCard = APIPlayerCard
> extends Card<T> {
	/**
	 * The amount of cards in the player card
	 */
	count: number;

	/**
	 * The level of the card
	 */
	level: number;

	/**
	 * The player that owns this card
	 */
	readonly player: Player;

	/**
	 * The star level of the card
	 */
	starLevel?: number;

	/**
	 * @param client - The client that instantiated this card
	 * @param data - The data of the card
	 * @param player - The player that owns this card
	 */
	constructor(client: ClientRoyale, data: T, player: Player) {
		super(client, data);

		this.player = player;
		this.count = data.count;
		this.level = data.level;
		this.starLevel = data.starLevel;
	}

	/**
	 * Clone this card.
	 */
	clone(): PlayerCard {
		return new PlayerCard(this.client, this.toJson(), this.player);
	}

	/**
	 * Check whether this card is equal to another.
	 * @param card - The card to compare to
	 */
	equals(card: PlayerCard): card is this {
		return (
			super.equals(card) &&
			this.count === card.count &&
			this.level === card.level &&
			this.player.id === card.player.id &&
			this.starLevel === card.starLevel
		);
	}

	/**
	 * Patch this card.
	 * @param data - The data to patch this card with
	 * @returns The patched card
	 */
	patch(data: Partial<T>): this {
		if (data.count != null) this.count = data.count;
		if (data.level != null) this.level = data.level;
		if (data.starLevel != null) this.starLevel = data.starLevel;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this card.
	 */
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
