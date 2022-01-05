import Collection from "@discordjs/collection";
import type {
	ClientRoyale,
	ConstructableStructure,
	ConstructorExtras,
	EventsOptions,
	ManagerOptions,
	StructureType,
} from "..";

/**
 * Handle structures' data
 * @template T - The structure class this manager handles
 */
export class Manager<T extends ConstructableStructure> extends Collection<
	T["prototype"]["id"],
	T["prototype"]
> {
	/**
	 * The client that instantiated this manager
	 */
	readonly client: ClientRoyale;

	/**
	 * The events of this manager
	 */
	readonly events: EventsOptions<T>;

	/**
	 * Other parameters for the structure class
	 */
	readonly extras: ConstructorExtras<T>;

	/**
	 * The method to sort the data
	 */
	sortMethod?: ManagerOptions<T>["sortMethod"];

	/**
	 * The structure class this manager handles
	 */
	readonly structure: T;

	/**
	 * @param client - The client that instantiated this manager
	 * @param structure - The structure class this manager handles
	 * @param options - The options to initialize this manager with
	 * @param args - Other parameters for the structure class
	 */
	constructor(
		client: ClientRoyale,
		structure: T,
		{ addEvent, data, removeEvent, sortMethod, updateEvent }: ManagerOptions<T>,
		...args: ConstructorExtras<T>
	) {
		super();
		this.client = client;
		this.events = {
			add: addEvent,
			remove: removeEvent,
			update: updateEvent,
		};
		this.extras = args;
		this.sortMethod = sortMethod;
		this.structure = structure;
		if (data !== undefined) for (const element of data) this.add(element);
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 * @template S - The type to cast the structure to
	 */
	add<S extends T["prototype"] = T["prototype"]>(data: StructureType<T>): S;
	add(...data: StructureType<T>[]): this;
	add(...data: StructureType<T>[]): T["prototype"] | this {
		let instance: T["prototype"] | undefined;

		for (const element of data) {
			instance = new this.structure(this.client, element, ...this.extras);
			const existing = this.get(instance.id);

			if (existing !== undefined) {
				const old = existing.clone();

				existing.patch(element);
				if (!existing.equals(old))
					this.client.emit(this.events.update, ...([old, existing] as never));
				continue;
			}
			this.set(instance.id, instance);
			this.sort();
			this.client.emit(this.events.add, ...([instance] as never));
		}
		return data.length === 1 ? instance! : this;
	}

	/**
	 * Check if this manager has all the items of another manager.
	 * @param manager - The manager to check against
	 * @returns Whether or not this manager has all the items of another manager
	 */
	equals(manager: Manager<T>): manager is this {
		for (const [id] of this) if (!manager.has(id)) return false;
		return true;
	}

	/**
	 * Override all the structures in this manager.
	 * @param items - The items to add
	 * @returns The patched manager
	 */
	overrideItems(items: StructureType<T>[]): this {
		this.clear();
		this.add(...items);
		return this;
	}

	/**
	 * Removes a structure from this manager.
	 * @param id - The id of the structure to remove
	 * @returns The removed structure, if it exists
	 */
	remove(id: T["prototype"]["id"]): T["prototype"] | undefined {
		const existing = this.get(id);

		if (existing === undefined) return undefined;
		this.delete(id);
		this.client.emit(this.events.remove, ...([existing] as never));
		return existing;
	}

	/**
	 * Sort the structures in this manager using the {@link sortMethod}.
	 * @returns The sorted manager
	 */
	sort(): this {
		if (this.sortMethod) super.sort(this.sortMethod);
		return this;
	}

	/**
	 * Get a JSON representation of this manager.
	 * @returns An array of the JSON representations of the structures in this manager
	 */
	toJSON(): StructureType<T>[] {
		return this.map((structure) => structure.toJSON()) as StructureType<T>[];
	}
}

export default Manager;
