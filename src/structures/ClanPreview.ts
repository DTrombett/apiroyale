import type {
	APIPlayerClan,
	Clan,
	ClientRoyale,
	CurrentRiverRace,
	FetchOptions,
	FetchRiverRaceLogOptions,
	RiverRaceLogResults,
} from "..";
import { FinishedRiverRaceManager } from "../managers";
import Structure from "./Structure";

/**
 * A clan preview
 */
export class ClanPreview<
	T extends APIPlayerClan = APIPlayerClan
> extends Structure<T> {
	/**
	 * The clan's badge id
	 */
	badgeId: number;

	/**
	 * The clan's name
	 */
	name: string;

	/**
	 * The river race log of this clan
	 */
	readonly riverRaceLog: FinishedRiverRaceManager;

	/**
	 * The clan's tag
	 */
	readonly tag: string;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, data.tag);

		this.riverRaceLog = new FinishedRiverRaceManager(client, data.tag);
		this.tag = data.tag;
		this.badgeId = data.badgeId;
		this.name = data.name;
	}

	/**
	 * The badge url of the clan.
	 * * Note: The image url is from deckshop.pro
	 */
	get badgeUrl(): `https://www.deckshop.pro/img/badges/${this["badgeId"]}.png` {
		return `https://www.deckshop.pro/img/badges/${this.badgeId}.png` as const;
	}

	/**
	 * The current river race of this clan, if fetched.
	 * Use {@link Clan.fetchCurrentRiverRace} to fetch it
	 */
	get currentRiverRace(): CurrentRiverRace | null {
		return this.client.races.get(this.id) ?? null;
	}

	/**
	 * Clone this clan preview.
	 * @returns The cloned clan preview
	 */
	clone(): ClanPreview<T> {
		return new ClanPreview(this.client, this.toJSON() as T);
	}

	/**
	 * Check if this clan is equal to another.
	 * @param clan - The other clan
	 * @returns Whether this clan is equal to the other clan
	 */
	equals(clan: ClanPreview<T>): clan is this {
		return (
			super.equals(clan) &&
			this.badgeId === clan.badgeId &&
			this.name === clan.name &&
			this.tag === clan.tag
		);
	}

	/**
	 * Fetch this clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new clan
	 */
	fetch(options?: FetchOptions): Promise<Clan> {
		return this.client.clans.fetch(this.id, options);
	}

	/**
	 * Fetch the current river race of this clan.
	 * @param options - Options for fetching the current river race
	 * @returns The current river race of this clan
	 */
	fetchCurrentRiverRace(options: FetchOptions): Promise<CurrentRiverRace> {
		return this.client.races.fetch(this.id, options);
	}

	/**
	 * Fetch the river race log of this clan.
	 * @param options - Options for fetching the river race log
	 * @returns The river race log of this clan
	 */
	async fetchRiverRaceLog(
		options?: FetchRiverRaceLogOptions
	): Promise<RiverRaceLogResults> {
		return this.client.fetchRiverRaceLog({
			...options,
			tag: this.id,
		});
	}

	/**
	 * Patch this clan.
	 * @param data - The data to patch this clan with
	 * @returns The new clan
	 */
	patch(data: Partial<T>): this {
		if (data.badgeId !== undefined) this.badgeId = data.badgeId;
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJSON(): APIPlayerClan {
		return {
			...super.toJSON(),
			badgeId: this.badgeId,
			name: this.name,
			tag: this.tag,
		};
	}
}

export default ClanPreview;
