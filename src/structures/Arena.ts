import type { APIArena, ClientRoyale, StringId } from "..";
import Structure from "./Structure";

/**
 * An arena
 */
export class Arena<T extends APIArena = APIArena> extends Structure<T> {
	/**
	 * The id of this arena
	 */
	declare readonly id: StringId;

	/**
	 * The name of this arena
	 */
	name: string;

	/**
	 * @param client - The client that instantiated this arena
	 * @param data - The data of the arena
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.id}`);

		this.name = data.name;
	}

	/**
	 * Clone this arena.
	 * @returns The cloned arena
	 */
	clone(): Arena<T> {
		return new Arena(this.client, this.toJSON());
	}

	/**
	 * Check whether this arena is equal to another arena.
	 * @param arena - The arena to compare to
	 * @returns Whether the arenas are equal
	 */
	equals(arena: Arena<T>): arena is this {
		return (
			super.equals(arena) && this.id === arena.id && this.name === arena.name
		);
	}

	/**
	 * Patch this arena.
	 * @param data - The data to patch this arena with
	 * @returns The patched arena
	 */
	patch(data: Partial<T>): this {
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this arena.
	 * @returns The JSON representation of this arena
	 */
	toJSON(): APIArena {
		return {
			...super.toJSON(),
			name: this.name,
			id: Number(this.id),
		};
	}
}

export default Arena;
