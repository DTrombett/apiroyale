import type ClientRoyale from "..";
import type { APILocation, FetchOptions, StringId } from "..";
import Structure from "./Structure";

/**
 * A location
 */
export class Location<
	T extends APILocation = APILocation
> extends Structure<T> {
	/**
	 * The location's country code, if it is a country
	 */
	countryCode?: string;

	/**
	 * The id of this location
	 */
	readonly id!: StringId;

	/**
	 * The location's name
	 */
	name: string;

	/**
	 * If the location is a country
	 */
	private _isCountry: boolean;

	/**
	 * @param client - The client that instantiated this location
	 * @param data - The data of the location
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, `${data.id}`);

		this.countryCode = data.countryCode;
		this.name = data.name;
		this._isCountry = data.isCountry;
	}

	/**
	 * Clone this location.
	 * @returns The cloned location
	 */
	clone(): Location<T> {
		return new Location(this.client, this.toJSON());
	}

	/**
	 * Check whether this location is equal to another location.
	 * @param location - The location to compare to
	 * @returns Whether the locations are equal
	 */
	equals(location: Location<T>): location is this {
		return (
			super.equals(location) &&
			this.countryCode === location.countryCode &&
			this.id === location.id &&
			this.name === location.name &&
			this._isCountry === location._isCountry
		);
	}

	/**
	 * Fetch this location.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new location
	 */
	fetch(options: FetchOptions): Promise<this> {
		return this.client.locations.fetch<this>(this.id, options);
	}

	/**
	 * Check if the location is a country.
	 * @returns Whether this location is a country
	 */
	isCountry(): this is { countryCode: string } {
		return this._isCountry;
	}

	/**
	 * Patch this location.
	 * @param data - The data to patch this location with
	 * @returns The patched location
	 */
	patch(data: Partial<T>): this {
		if (data.countryCode !== undefined) this.countryCode = data.countryCode;
		if (data.isCountry !== undefined) this._isCountry = data.isCountry;
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this location.
	 * @returns The JSON representation of this location
	 */
	toJSON(): APILocation {
		return {
			...super.toJSON(),
			countryCode: this.countryCode,
			id: Number(this.id),
			isCountry: this._isCountry,
			name: this.name,
		};
	}
}

export default Location;
