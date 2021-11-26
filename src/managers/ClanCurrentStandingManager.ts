import type ClientRoyale from "..";
import type { APIClanCurrentStanding, CurrentRiverRace } from "..";
import { Manager } from "..";
import ClanCurrentStanding from "../structures/ClanCurrentStanding";

/**
 * A manager for clans current standings
 */
export class ClanCurrentStandingManager extends Manager<
	typeof ClanCurrentStanding
> {
	/**
	 * The race of this manager
	 */
	race: CurrentRiverRace;

	/**
	 * @param client - The client that instantiated this manager
	 * @param race - The race of this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(
		client: ClientRoyale,
		race: CurrentRiverRace,
		data?: APIClanCurrentStanding[]
	) {
		super(client, ClanCurrentStanding, data);

		this.race = race;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends ClanCurrentStanding = ClanCurrentStanding>(
		data: APIClanCurrentStanding
	): S {
		const existing = this.get(data[ClanCurrentStanding.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const clan = new ClanCurrentStanding(this.client, data, this.race) as S;
		this.set(clan.id, clan);
		this.client.emit("structureAdd", clan);
		return clan;
	}

	/**
	 * Removes a clan from the manager.
	 * @param tag - The tag of the clan to remove
	 * @returns The removed clan, if it exists
	 */
	remove(tag: string): ClanCurrentStanding | undefined {
		return super.remove(tag);
	}
}

export default ClanCurrentStandingManager;
