import type {
	ConstructableFetchableStructure,
	FetchOptions,
	StructureType,
} from "..";
import Constants from "../util";
import Manager from "./Manager";

/**
 * A manager of fetchable structures
 * @template T - The structure class this manager handles
 */
export class FetchableManager<
	T extends ConstructableFetchableStructure
> extends Manager<T> {
	/**
	 * Fetches a structure from the API.
	 * @param id - The id of the structure to fetch
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched structure
	 * @template S - The type to cast the structure to
	 */
	async fetch<S extends T["prototype"] = T["prototype"]>(
		id: T["prototype"]["id"],
		{ force = false, maxAge = Constants.defaultMaxAge }: FetchOptions = {}
	): Promise<S> {
		const existing = this.get(id) as S | undefined;

		if (
			existing &&
			!force &&
			Date.now() - existing.lastUpdate.getTime() < maxAge
		)
			return existing;
		return this.add<S>(
			await this.client.api.get<StructureType<T>>(this.structure.path(id))
		);
	}
}

export default FetchableManager;
