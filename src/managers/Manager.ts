import type ClientRoyale from "..";
import type { ManagerOptions, StructureOptions } from "..";
import { Collection } from "../util";

/**
 * Handle structures' data
 * @template T - The structure class this manager handles
 */
export class Manager<K extends number | string | symbol, V> extends Collection<
	K,
	V
> {
	/**
	 * The client that instantiated this manager
	 */
	readonly client: ClientRoyale;

	/**
	 * The options for this manager
	 */
	options: ManagerOptions<V>;

	/**
	 * When each value should be considered outdated
	 */
	maxAges: Partial<Record<K, number>> = {};

	/**
	 * @param client - The client that instantiated this manager
	 * @param items - The items to add
	 */
	constructor(
		client: ClientRoyale,
		options: ManagerOptions<V>,
		...items: (readonly [K, V])[]
	) {
		super(items);

		this.options = options;
		this.client = client;
	}

	/**
	 * Adds a structure to this manager.
	 * @param key - The key of the structure to add
	 * @param value - The structure to add
	 * @param options - Options for the structure
	 * @returns The added structure
	 */
	add<T extends V>(key: K, value: T, options: StructureOptions = {}): T {
		const old = this.get(key);

		this.maxAges[key] = options.maxAge;
		if (old === undefined) {
			this.set(key, value);
			if (this.options.addEvent)
				this.client.emit(this.options.addEvent, ...([value] as never));
			return value;
		}
		const clone = { ...old };

		for (const k in value)
			if (Object.prototype.hasOwnProperty.call(value, k))
				(old as typeof value)[k] = value[k];
		if (this.options.updateEvent)
			this.client.emit(this.options.updateEvent, ...([clone, old] as never));
		return old as T;
	}

	/**
	 * Checks if a structure is outdated.
	 * @param id - The key of the structure to check
	 * @returns Whether the structure is outdated
	 */
	isOutdated(id: K): boolean {
		return this.maxAges[id] !== undefined && Date.now() > this.maxAges[id];
	}

	/**
	 * Removes a structure from this manager.
	 * @param id - The id of the structure to remove
	 * @returns The removed structure, if it exists
	 */
	remove(id: K): V | undefined {
		const existing = this.get(id);

		if (existing === undefined) return undefined;
		this.delete(id);
		delete this.maxAges[id];
		if (this.options.removeEvent)
			this.client.emit(this.options.removeEvent, ...([existing] as never));
		return existing;
	}
}

export default Manager;
