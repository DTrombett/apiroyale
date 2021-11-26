import Collection from "@discordjs/collection";
import type {
	ClientRoyale,
	ConstructableStructure,
	ConstructorExtras,
	EventsOptions,
	StructureEvents,
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
		{
			addEvent,
			data,
			removeEvent,
		}: {
			addEvent: StructureEvents<T>;
			data?: StructureType<T>[];
			removeEvent: StructureEvents<T>;
		},
		...args: ConstructorExtras<T>
	) {
		super();

		this.client = client;
		this.events = {
			add: addEvent,
			remove: removeEvent,
		};
		this.extras = args;
		this.structure = structure;

		if (data !== undefined) for (const element of data) this.add(element);
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 * @template S - The type to cast the structure to
	 */
	add<S extends T["prototype"] = T["prototype"]>(data: StructureType<T>): S {
		const existing = this.get(
			`${data[this.structure.id] as number | string}` as T["prototype"]["id"]
		) as S | undefined;

		if (existing !== undefined) return existing.patch(data);
		const instance = new this.structure(this.client, data, ...this.extras) as S;
		this.set(instance.id as T["prototype"]["id"], instance);
		if (this.events.add !== undefined)
			this.client.emit(this.events.add, ...([instance] as never));
		return instance;
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
		if (this.events.remove !== undefined)
			this.client.emit(this.events.remove, ...([existing] as never));
		return existing;
	}
}

export default Manager;
