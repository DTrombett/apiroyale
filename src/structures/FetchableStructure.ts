import type { FetchOptions, JsonObject, Path } from "../util";
import Constants from "../util";
import Structure from "./Structure";

/**
 * A structure that can be fetched
 */
export class FetchableStructure<
	T extends JsonObject = JsonObject
> extends Structure<T> {
	/**
	 * The route to fetch the structure from
	 */
	static route: Path;

	/**
	 * Gets the path to fetch the structure from
	 * @param id - The id of the structure
	 * @returns The path to fetch the structure from
	 */
	static path(id: string): Path {
		return this.route.replace(":id", id) as Path;
	}

	/**
	 * Fetches this structure.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new structure
	 */
	async fetch({
		force = false,
		maxAge = Constants.defaultMaxAge,
	}: FetchOptions = {}): Promise<FetchableStructure> {
		if (!force && Date.now() - this.lastUpdate.getTime() < maxAge)
			return Promise.resolve(this);

		const data = await this.client.api.get<T>(
			(this.constructor as typeof FetchableStructure).path(this.id)
		);
		return this.patch(data);
	}
}

export default FetchableStructure;
