import type ClientRoyale from "..";
import type { APIChest } from "..";
import Structure from "./Structure";

/**
 * An upcoming chest
 */
export class UpcomingChest<T extends APIChest = APIChest> extends Structure<T> {
	/**
	 * The index of this chest
	 */
	readonly index: number;

	/**
	 * The name of the chest
	 */
	name: string;

	/**
	 * @param client - The client that instantiated this chest
	 * @param data - The data of the chest
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.index}`);

		this.index = data.index;
		this.name = data.name;
	}

	/**
	 * Clone this chest.
	 * @returns The cloned chest
	 */
	clone(): UpcomingChest<T> {
		return new UpcomingChest(this.client, this.toJSON());
	}

	/**
	 * Check whether this chest is equal to another chest.
	 * @param chest - The chest to compare to
	 * @returns Whether the chests are equal
	 */
	equals(chest: UpcomingChest<T>): chest is this {
		return (
			super.equals(chest) &&
			this.index === chest.index &&
			this.name === chest.name
		);
	}

	/**
	 * Patch this chest.
	 * @param data - The data to patch this chest with
	 * @returns The patched chest
	 */
	patch(data: Partial<T>): this {
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this card.
	 * @returns The card's data
	 */
	toJSON(): APIChest {
		return {
			...super.toJSON(),
			index: this.index,
			name: this.name,
		};
	}
}

export default UpcomingChest;
