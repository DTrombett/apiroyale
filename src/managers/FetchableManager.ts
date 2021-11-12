import type {
	ConstructableFetchableStructure,
	FetchOptions,
	StructureType,
} from "..";
import type { NonNullableProperties } from "../util";
import Constants from "../util";
import Manager from "./Manager";

/**
 * A manager that can fetch structures
 */
export class FetchableManager<
	T extends ConstructableFetchableStructure = ConstructableFetchableStructure
> extends Manager<T> {
	/**
	 * Fetches a structure from the API.
	 * @param id - The id of the structure to fetch
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the fetched structure
	 */
	async fetch<S extends T["prototype"] = T["prototype"]>(
		id: string,
		{ force = false, maxAge = Constants.defaultMaxAge }: FetchOptions = {}
	): Promise<NonNullableProperties<S, keyof S>> {
		const data = this.get(id) as S | undefined;

		if (
			data &&
			!force &&
			data.isNotPartial() &&
			Date.now() - data.lastUpdate.getTime() < maxAge
		)
			return data;
		return this.add(
			await this.client.api.get<StructureType<T>>(this.structure.path(id))
		);
	}
}

export default FetchableManager;
