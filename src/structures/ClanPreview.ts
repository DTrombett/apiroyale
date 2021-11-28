import type {
	APIClanPreview,
	APITag,
	Clan,
	ClientRoyale,
	FetchOptions,
} from "..";
import { Routes } from "../util";
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
	 * The clan's tag
	 */
	readonly tag: APITag;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, data.tag);
		this.tag = data.tag;
		this.patch({
			...data,
			tag: undefined,
		});
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
		return this.client.clans.fetch(Routes.Clan(this.tag), this.id, options);
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
