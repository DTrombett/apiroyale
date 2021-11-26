import type { APILocation, ClientRoyale } from "..";
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
		super(client, Location, {
			addEvent: "newLocation",
			data,
			removeEvent: "locationRemoved",
		});
	}
}

export default LocationManager;
