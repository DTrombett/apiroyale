import type { APILocation, ClientRoyale, FetchOptions, StringId } from "..";
import { Location } from "../structures";
import FetchableManager from "./FetchableManager";

/**
 * A manager for locations
 */
export class LocationManager extends FetchableManager<typeof Location> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APILocation[]) {
		super(client, Location, data);
	}

	/**
	 * Adds a location to this manager.
	 * @param data - The data of the location to add
	 * @returns The added location
	 */
	add(data: APILocation): Location {
		return super.add(data);
	}

	/**
	 * Fetches a location from the API.
	 * @param id - The id of the location to fetch
	 * @param optons - The options for the fetch
	 * @returns A promise that resolves with the fetched location
	 */
	fetch(id: StringId, options?: FetchOptions): Promise<Location> {
		return super.fetch(id, options);
	}

	/**
	 * Removes a location from this manager.
	 * @param id - The id of the location to remove
	 * @returns The removed location, if it exists
	 */
	remove(id: StringId): Location | undefined {
		return super.remove(id);
	}
}

export default LocationManager;
