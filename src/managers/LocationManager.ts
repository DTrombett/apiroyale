import type { APILocation, ClientRoyale, StringId } from "..";
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
	 * Removes a location from this manager.
	 * @param id - The id of the location to remove
	 * @returns The removed location, if it exists
	 */
	remove(id: StringId): Location | undefined {
		return super.remove(id);
	}
}

export default LocationManager;
