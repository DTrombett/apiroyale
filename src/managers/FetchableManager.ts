import type {
	ClientRoyale,
	ConstructableStructure,
	ConstructorExtras,
	FetchableManagerOptions,
	FetchOptions,
	StringId,
	StructureType,
} from "..";
import Manager from "./Manager";

/**
 * A manager of fetchable structures
 * @template T - The structure class this manager handles
 */
export class FetchableManager<
	T extends ConstructableStructure
> extends Manager<T> {
	/**
	 * The route to fetch the data from
	 */
	route: FetchableManagerOptions<T>["route"];

	/**
	 * @param client - The client that instantiated this manager
	 * @param structure - The structure class this manager handles
	 * @param options - The options to initialize this manager with
	 * @param args - Other parameters for the structure class
	 */
	constructor(
		client: ClientRoyale,
		structure: T,
		options: FetchableManagerOptions<T>,
		...args: ConstructorExtras<T>
	) {
		super(client, structure, options, ...args);
		this.route = options.route;
	}

	/**
	 * Fetch a structure from the API.
	 * @param path - The path of the structure to fetch
	 * @param id - The id of the structure to fetch
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched structure
	 * @template S - The type to cast the structure to
	 */
	async fetch<S extends T["prototype"] = T["prototype"]>(
		id: T["prototype"]["id"],
		{ force = false }: FetchOptions = {}
	): Promise<S> {
		const existing = this.get(id) as S | undefined;

		if (
			existing &&
			!force &&
			Date.now() - existing.lastUpdate.getTime() < this.client.structureMaxAge
		)
			return existing;
		return this.add<S>(
			(await this.client.api.get(
				this.route(id as StringId)
			)) as StructureType<T>
		);
	}
}

export default FetchableManager;
