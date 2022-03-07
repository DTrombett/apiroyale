/* eslint-disable @typescript-eslint/ban-types */
import ClientRoyale from "../ClientRoyale";

/**
 * Base class for all other structures
 */
export class Structure<T extends {} = {}> {
	/**
	 * The client that instantiated this structure
	 */
	readonly client: ClientRoyale;

	/**
	 * An unique identifier for this structure
	 */
	readonly id: string;

	/**
	 * When this structure was last updated
	 */
	lastUpdate = new Date();

	/**
	 * @param client - The client that instantiated this structure
	 * @param _data - The data of the structure
	 * @param id - The id of the structure
	 */
	constructor(client: ClientRoyale, _data: T, id: string) {
		if (!(client instanceof ClientRoyale))
			throw new TypeError("Argument 'client' must be a ClientRoyale");
		if (typeof id !== "string")
			throw new TypeError("Argument 'id' must be a string");
		this.client = client;
		this.id = id;
	}

	/**
	 * Clone this structure.
	 * @returns The cloned structure
	 */
	clone(): Structure {
		return new Structure(this.client, this.toJSON(), this.id);
	}

	/**
	 * Check whether this structure is equal to another structure.
	 * @param structure - The structure to compare to
	 * @returns Whether the structures are equal
	 */
	equals(structure: Structure): structure is this {
		if (!(structure instanceof Structure))
			throw new TypeError("Argument 'structure' must be a Structure");
		return this.id === structure.id;
	}

	/**
	 * Patch this structure.
	 * @param _data - The data to patch this structure with
	 * @returns The patched structure
	 */
	patch(_data: Partial<T>): this {
		this.lastUpdate = new Date();

		return this;
	}

	/**
	 * Get a JSON representation of this structure.
	 * @returns The JSON representation of this structure
	 */
	toJSON(): {} {
		return {};
	}

	/**
	 * Gets a string representation of this structure.
	 * @returns The JSON stringification of this structure
	 */
	toString(): string {
		return JSON.stringify(this.toJSON());
	}
}

export default Structure;
