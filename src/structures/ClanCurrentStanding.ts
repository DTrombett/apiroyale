import type { CurrentRiverRace } from ".";
import type { APIClanCurrentStanding, ClientRoyale } from "..";
import BaseClanStanding from "./BaseClanStanding";

/**
 * A clan week standing
 */
export class ClanCurrentStanding<
	T extends APIClanCurrentStanding = APIClanCurrentStanding
> extends BaseClanStanding<T> {
	/**
	 * The race that this clan is in
	 */
	readonly race: CurrentRiverRace;

	/**
	 * @param client - The client that instantiated this clan standing
	 * @param data - The data for this clan standing
	 * @param race - The race that this clan is in
	 */
	constructor(client: ClientRoyale, data: T, race: CurrentRiverRace) {
		super(client, data);
		this.race = race;
		this.patch(data);
	}

	/**
	 * Clone this standing
	 * @returns A clone of this standing
	 */
	clone(): ClanCurrentStanding<T> {
		return new ClanCurrentStanding(this.client, this.toJson(), this.race);
	}

	/**
	 * Check if this standing is equal to another standing
	 * @param other - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(other: ClanCurrentStanding<T>): boolean {
		return super.equals(other) && this.race.monthDay === other.race.monthDay;
	}

	/**
	 * Patch this standing
	 * @param data - The data to patch the standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		return this;
	}

	/**
	 * Gets a JSON representation of this standing
	 * @returns The JSON representation of this standing
	 */
	toJson(): APIClanCurrentStanding {
		return {
			...super.toJson(),
		};
	}
}

export default ClanCurrentStanding;
