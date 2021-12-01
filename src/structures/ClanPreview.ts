import type {
	APIClanPreview,
	APITag,
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
	T extends APIClanPreview = APIClanPreview
> extends Structure<T> {
	/**
	 * The clan's badge id
	 */
	badgeId!: number;

	readonly id!: APITag;

	/**
	 * The clan's name
	 */
	name!: string;

	/**
	 * The river race log of this clan
	 */
	readonly riverRaceLog: FinishedRiverRaceManager;

	/**
	 * The clan's tag
	 */
	readonly tag: APITag;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, data.tag);
		this.riverRaceLog = new FinishedRiverRaceManager(client);
		this.tag = data.tag;
		this.patch({
			...data,
			tag: undefined,
		});
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
		return new ClanPreview(this.client, this.toJson());
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
	toJson(): APIClanPreview {
		return {
			...super.toJson(),
			badgeId: this.badgeId,
			name: this.name,
			tag: this.tag,
		};
	}
}

export default ClanPreview;
