import Collection from "@discordjs/collection";
import type { ClientRoyale, ConstructableStructure, StructureType } from "..";

/**
 * A manager to handle structures' data
 */
export class Manager<
	T extends ConstructableStructure = ConstructableStructure
> extends Collection<string, T["prototype"]> {
	/**
	 * The client that instantiated this manager
	 */
	readonly client: ClientRoyale;

	/**
	 * The structure class this manager handles
	 */
	readonly structure: T;

	/**
	 * @param client - The client that instantiated this manager
	 * @param structure - The structure class this manager handles
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, structure: T, data?: StructureType<T>[]) {
		super(
			data?.map((APIInstance) => {
				const instance = new structure(client, APIInstance);

				return [instance.id, instance];
			})
		);

		this.client = client;
		this.structure = structure;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends T["prototype"] = T["prototype"]>(
		data: Partial<StructureType<T>>
	): S {
		const existing = this.get(data[this.structure.id] as string) as
			| S
			| undefined;
		if (existing != null) return existing.patch(data);
		const instance = new this.structure(this.client, data) as S;
		this.set(instance.id, instance);
		this.client.emit("structureAdd", instance);
		return instance;
	}

	/**
	 * Removes a structure from this manager.
	 * @param id - The id of the structure to remove
	 * @returns The removed structure, if it exists
	 */
	remove(id: string): this["structure"]["prototype"] | undefined {
		const existing = this.get(id);

		if (existing == null) return undefined;
		this.delete(id);
		this.client.emit("structureRemove", existing);
		return existing;
	}
}

export default Manager;
