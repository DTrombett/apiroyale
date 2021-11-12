import type {
	APIArena,
	ClientRoyale,
	NonNullableProperties,
	StringId,
} from "..";
import Structure from "./Structure";

/**
 * A class representing an arena
 */
export class Arena extends Structure<APIArena> {
	static id = "id";

	/**
	 * The id of this arena
	 */
	readonly id: StringId;

	/**
	 * The name of the arena
	 */
	name: string;

	/**
	 * @param client - The client that instantiated this arena
	 * @param data - The data of the arena
	 */
	constructor(client: ClientRoyale, data: APIArena) {
		super(client, data);

		this.id = data.id.toString() as StringId;
		this.name = data.name;
	}

	/**
	 * Clone this arena.
	 */
	clone(): Arena {
		return new Arena(this.client, this.toJson());
	}

	/**
	 * Checks whether this arena is equal to another arena, comparing all properties.
	 * @param other - The arena to compare to
	 * @returns Whether the arenas are equal
	 */
	equals(other: Arena): boolean {
		return super.equals(other) && this.name === other.name;
	}

	/**
	 * Patches this arena.
	 * @param data - The data to update this arena with
	 * @returns The updated arena
	 */
	patch(data: APIArena): NonNullableProperties<this, keyof this>;
	patch(data: Partial<APIArena>): this;
	patch(data: Partial<APIArena>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (!this.equals(old)) this.client.emit("arenaUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this arena.
	 * @returns The JSON representation of this arena
	 */
	toJson(): APIArena {
		return {
			...super.toJson(),
			name: this.name,
			id: Number(this.id),
		};
	}

	/**
	 * Gets a string representation of this arena.
	 * @returns The name of this arena
	 */
	toString(): string {
		return this.name;
	}
}

export default Arena;
