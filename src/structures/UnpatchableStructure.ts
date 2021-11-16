import type ClientRoyale from "..";
import type { JsonObject } from "..";

/**
 * A structure that cannot be patched
 */
export class UnpatchableStructure<T extends JsonObject> {
	/**
	 * The client that instantiated this structure
	 */
	client: ClientRoyale;

	/**
	 * @param client - The client that instantiated this structure
	 */
	constructor(client: ClientRoyale) {
		this.client = client;
	}

	/**
	 * Clone this structure.
	 */
	clone() {
		return new UnpatchableStructure(this.client);
	}

	/**
	 * Checks whether this structure is equal to another structure, comparing all properties.
	 * @param other - The structure to compare to
	 * @returns Whether the structures are equal
	 */
	equals(_other: UnpatchableStructure<T>): boolean {
		return true;
	}

	/**
	 * Gets a JSON representation of this structure.
	 * @returns The JSON representation of this structure
	 */
	toJson(): T {
		throw new Error("Not implemented");
	}

	/**
	 * Gets a string representation of this structure.
	 * @returns The stringified JSON representation of this structure
	 */
	toString(): string {
		throw new Error("Not implemented");
	}
}

export default UnpatchableStructure;
