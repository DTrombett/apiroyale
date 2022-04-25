import { Routes } from "royale-api-types";
import type ClientRoyale from "..";
import type { APICurrentRiverRace, FetchOptions, StructureOptions } from "..";
import { Manager } from "./Manager";

/**
 * A manager for current river races
 */
export class CurrentRiverRaceManager extends Manager<
	APICurrentRiverRace["clan"]["tag"],
	APICurrentRiverRace
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APICurrentRiverRace[]) {
		super(
			client,
			{
				addEvent: "currentRiverRaceAdd",
				removeEvent: "currentRiverRaceRemove",
				updateEvent: "currentRiverRaceUpdate",
			},
			...data.map((race) => [race.clan.tag, race] as const)
		);
	}

	add<T extends APICurrentRiverRace>(
		key: string,
		value: T,
		options?: StructureOptions
	): T {
		if (options?.cacheNested ?? this.client.defaults.defaultCacheNested)
			for (const clan of value.clans)
				this.client.clans.add(clan.tag, clan, options);
		return super.add(key, value, options);
	}

	/**
	 * Retrieve information about clan's current river race.
	 * @param clanTag - Tag of the clan
	 * @param options - Options for the request
	 * @returns The current river race
	 */
	async fetch(
		clanTag: string,
		options: FetchOptions = {}
	): Promise<APICurrentRiverRace> {
		const existing = this.get(clanTag);

		if (existing && options.force !== true && !this.isOutdated(clanTag))
			return existing;
		const race = await this.client.api.get(Routes.CurrentRiverRace(clanTag));

		return this.add(clanTag, race.data, {
			maxAge: race.maxAge,
		});
	}
}

export default CurrentRiverRaceManager;
