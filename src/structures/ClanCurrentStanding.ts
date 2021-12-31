import type {
	APIClanCurrentStanding,
	ClientRoyale,
	CurrentRiverRace,
} from "..";
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
	}

	/**
	 * Clone this standing.
	 * @returns A clone of this standing
	 */
	clone(): ClanCurrentStanding<T> {
		return new ClanCurrentStanding(this.client, this.toJSON(), this.race);
	}

	/**
	 * Check if this standing is equal to another standing.
	 * @param standing - The other standing to compare to
	 * @returns Whether this standing is equal to the other standing
	 */
	equals(standing: ClanCurrentStanding<T>): standing is this {
		return super.equals(standing) && this.race.id === standing.race.id;
	}

	/**
	 * Patch this standing.
	 * @param data - The data to patch this standing with
	 * @returns The patched standing
	 */
	patch(data: Partial<T>): this {
		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this standing.
	 * @returns The JSON representation of this standing
	 */
	toJSON(): APIClanCurrentStanding {
		return {
			...super.toJSON(),
		};
	}
}

export default ClanCurrentStanding;
