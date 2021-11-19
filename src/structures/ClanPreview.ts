import FetchableStructure from "./FetchableStructure";
import type {
	APIClanPreview,
	APITag,
	Clan,
	ClientRoyale,
	FetchOptions,
} from "..";

/**
 * A clan preview
 */
export class ClanPreview<
	T extends APIClanPreview = APIClanPreview
> extends FetchableStructure<T> {
	static route = "/clans/:id" as const;
	static id = "tag" as const;

	/**
	 * The clan's tag
	 */
	readonly tag: APITag;

	/**
	 * The clan's badge id
	 */
	badgeId!: number;

	/**
	 * The clan's name
	 */
	name!: string;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.tag = data.tag;
		this.patch(data);
	}

	/**
	 * Clone this clan preview.
	 * @returns The cloned clan preview
	 */
	clone(): ClanPreview<T> {
		return new ClanPreview(this.client, this.toJson());
	}

	/**
	 * Checks if this clan is equal to another.
	 * @param other - The other clan
	 * @returns Whether this clan is equal to the other clan
	 */
	equals(other: ClanPreview<T>): boolean {
		return (
			super.equals(other) &&
			this.tag === other.tag &&
			this.name === other.name &&
			this.badgeId === other.badgeId
		);
	}

	/**
	 * Fetches this clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new clan
	 */
	fetch(options?: FetchOptions): Promise<Clan> {
		return this.client.clans.fetch(this.tag, options);
	}

	/**
	 * Patches this clan.
	 * @param data - The data to patch
	 * @returns The new clan
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.badgeId !== undefined) this.badgeId = data.badgeId;

		return this;
	}

	/**
	 * Gets a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJson(): APIClanPreview {
		return {
			...super.toJson(),
			tag: this.tag,
			name: this.name,
			badgeId: this.badgeId,
		};
	}

	/**
	 * Gets a string representation of this clan.
	 * @returns The string representation of this clan
	 */
	toString(): string {
		return this.name;
	}
}

export default ClanPreview;
