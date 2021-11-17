import type ClientRoyale from "..";
import type { JsonObject } from "..";

/**
 * Base class for all structures
 */
export class Structure<T extends JsonObject = JsonObject> {
	/**
	 * The id's key of the structure
	 */
	static id = "tag";

	/**
	 * The client that instantiated this structure
	 */
	readonly client: ClientRoyale;

	/**
	 * An unique identifier for this structure
	 */
	id: string;

	/**
	 * When this structure was last updated
	 */
	lastUpdate = new Date();

	/**
	 * @param client - The client that instantiated this structure
	 * @param data - The data of the structure
	 */
	constructor(client: ClientRoyale, data: T) {
		const id = data[(this.constructor as typeof Structure).id]?.toString();

		this.client = client;

		if (id == null) throw new Error(`${this.constructor.name} id is null`);

		this.id = id;
	}

	/**
	 * Clone this structure.
	 */
	clone() {
		return new Structure(this.client, this.toJson());
	}

	/**
	 * Checks whether this structure is equal to another structure, comparing all properties.
	 * @param other - The structure to compare to
	 * @returns Whether the structures are equal
	 */
	equals(other: Structure): boolean {
		return this.id === other.id;
	}

	/**
	 * Patches this structure.
	 * @param _data - The data to update this structure with
	 * @returns The updated structure
	 */
	patch(_data: Partial<T>): this {
		this.lastUpdate = new Date();

		return this;
	}

	/**
	 * Gets a JSON representation of this structure.
	 * @returns The JSON representation of this structure
	 */
	toJson() {
		return {};
	}

	/**
	 * Gets a string representation of this structure.
	 * @returns The stringified JSON representation of this structure
	 */
	toString(): string {
		return JSON.stringify(this);
	}
}

export default Structure;
