import type ClientRoyale from "..";
import type { JsonObject, NonNullableProperties } from "..";

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
	readonly id: string;

	/**
	 * When this structure was last updated
	 */
	lastUpdate = new Date();

	/**
	 * @param client - The client that instantiated this structure
	 * @param data - The data of the structure
	 */
	constructor(client: ClientRoyale, data: T) {
		this.client = client;
		this.id = data[(this.constructor as typeof Structure).id].toString();
	}

	/**
	 * Clone this structure.
	 */
	clone() {
		return new (this.constructor as typeof Structure)(
			this.client,
			this.toJson()
		);
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
	 * Checks if this structure is not partial.
	 */
	isNotPartial(): this is NonNullableProperties<this, keyof this> {
		return true;
	}

	/**
	 * Patches this structure.
	 * @param _data - The data to update this structure with
	 * @returns The updated structure
	 */
	patch(data: T): NonNullableProperties<this, keyof this>;
	patch(data: Partial<T>): this;
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
