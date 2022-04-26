import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type {
	APILocation,
	APILocationList,
	FetchOptions,
	ListOptions,
} from "..";
import { Manager } from "./Manager";

/**
 * A manager for locations
 */
export class LocationManager extends Manager<APILocation["id"], APILocation> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APILocation[]) {
		super(
			client,
			{
				addEvent: "locationAdd",
				removeEvent: "locationRemove",
				updateEvent: "locationUpdate",
			},
			...data.map((item) => [item.id, item] as const)
		);
	}

	/**
	 * Get information about specific location.
	 * @param id - Identifier of the location to retrieve
	 * @param options - Options for the request
	 * @returns The location
	 */
	fetch(id: number, options?: FetchOptions): Promise<APILocation>;
	/**
	 * List locations.
	 * @param options - Options for the request
	 * @returns The locations
	 */
	fetch(options?: ListOptions): Promise<APILocationList>;
	async fetch(
		idOrOptions: ListOptions | number = {},
		options: FetchOptions = {}
	): Promise<APILocation | APILocationList> {
		if (typeof idOrOptions === "number") {
			const existing = this.get(idOrOptions);

			if (existing && options.force !== true && !this.isOutdated(idOrOptions))
				return existing;
			const location = await this.client.api.get(Routes.Location(idOrOptions));

			return this.add(location.data.id, location.data, {
				maxAge: location.maxAge,
			});
		}
		const query: Record<string, string> = {};

		if (idOrOptions.limit !== undefined)
			query.limit = idOrOptions.limit.toString();
		if (idOrOptions.after !== undefined) query.after = idOrOptions.after;
		if (idOrOptions.before !== undefined) query.before = idOrOptions.before;
		const locations = await this.client.api.get(Routes.Locations(), {
			query,
		});

		for (const season of locations.data.items)
			this.add(season.id, season, { maxAge: locations.maxAge, ...options });
		return locations.data;
	}
}

export default LocationManager;
