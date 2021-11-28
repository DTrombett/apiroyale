import type ClientRoyale from "..";
import type { JsonObject } from "..";

/**
 * Base class for all other structures
 */
export class Structure<T extends JsonObject = JsonObject> {
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
		this.client = client;
		this.id = id;
	}

	/**
	 * Clone this structure.
	 * @returns The cloned structure
	 */
	clone(): Structure {
		return new Structure(this.client, this.toJson(), this.id);
	}

	/**
	 * Check whether this structure is equal to another structure.
	 * @param structure - The structure to compare to
	 * @returns Whether the structures are equal
	 */
	equals(structure: Structure): structure is this {
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
	toJson(): JsonObject {
		return {};
	}
}

export default Structure;
