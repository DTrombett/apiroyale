import type ClientRoyale from "..";
import type {
	APILocation,
	FetchOptions,
	NonNullableProperties,
	Path,
	StringId,
} from "..";
import FetchableStructure from "./FetchableStructure";

/**
 * Represents a location
 */
export class Location extends FetchableStructure<APILocation> {
	static id = "id";
	static route: Path = "/locations/:id";

	/**
	 * The location's country code, if it is a country
	 */
	countryCode?: string;

	/**
	 * The id of this location
	 */
	readonly id: StringId;

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
	constructor(client: ClientRoyale, data: APILocation) {
		super(client, data);

		this.name = data.name;
		this.countryCode = data.countryCode;
		this.id = data.id.toString() as StringId;
		this._isCountry = data.isCountry;
	}

	/**
	 * Clone this location.
	 */
	clone(): Location {
		return new Location(this.client, this.toJson());
	}

	/**
	 * Checks whether this location is equal to another location, comparing all properties.
	 * @param other - The location to compare to
	 * @returns Whether the locations are equal
	 */
	equals(other: Location): boolean {
		return (
			super.equals(other) &&
			this.name === other.name &&
			this.countryCode === other.countryCode &&
			this._isCountry === other._isCountry
		);
	}

	/**
	 * Checks if the location is a country.
	 * @returns Whether this location is a country
	 */
	isCountry(): this is this & { countryCode: string } {
		return this._isCountry;
	}

	/**
	 * Patches this location.
	 * @param data - The data to update this location with
	 * @returns The updated location
	 */
	patch(data: APILocation): NonNullableProperties<this, keyof this>;
	patch(data: Partial<APILocation>): this;
	patch(data: Partial<APILocation>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.countryCode !== undefined) this.countryCode = data.countryCode;
		if (data.isCountry !== undefined) this._isCountry = data.isCountry;

		if (!this.equals(old)) this.client.emit("locationUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this location.
	 * @returns The JSON representation of this location
	 */
	toJson(): APILocation {
		return {
			...super.toJson(),
			id: Number(this.id),
			name: this.name,
			countryCode: this.countryCode,
			isCountry: this._isCountry,
		};
	}

	/**
	 * Gets a string representation of this location.
	 * @returns The name of this location
	 */
	toString() {
		return this.name;
	}

	/**
	 * Fetches this location.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new location
	 */
	fetch(options: FetchOptions) {
		return this.client.locations.fetch<this>(this.id, options);
	}
}

export default Location;
