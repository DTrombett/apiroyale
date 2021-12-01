import type { APIClanResultPreview, APIClanType, ClientRoyale } from "..";
import { ClanType } from "../util";
import ClanPreview from "./ClanPreview";
import Location from "./Location";

/**
 * A clan result preview
 */
export class ClanResultPreview<
	T extends APIClanResultPreview = APIClanResultPreview
> extends ClanPreview<T> {
	/**
	 * The donations made in the clan since this week started
	 */
	donationsPerWeek: number;

	/**
	 * The clan's location
	 */
	readonly location: Location;

	/**
	 * The clan's member count
	 */
	memberCount: number;

	/**
	 * The clan's required trophies to join
	 */
	requiredTrophies: number;

	/**
	 * The clan's score
	 */
	score: number;

	/**
	 * The type of clan
	 */
	type: ClanType;

	/**
	 * The clan's war trophies
	 */
	warTrophies: number;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data for this clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);

		this.location = new Location(client, data.location);
		this.donationsPerWeek = data.donationsPerWeek;
		this.memberCount = data.members;
		this.requiredTrophies = data.requiredTrophies;
		this.score = data.clanScore;
		this.type = ClanType[data.type];
		this.warTrophies = data.clanWarTrophies;
	}

	/**
	 * The location name of this clan
	 */
	get locationName(): string {
		return this.location.name;
	}

	/**
	 * Clone this clan result preview
	 * @returns A clone of this clan result preview
	 */
	clone(): ClanResultPreview<T> {
		return new ClanResultPreview(this.client, this.toJson());
	}

	/**
	 * Check if this clan is equal to another clan
	 * @param clan - The other clan to compare to
	 * @returns Whether this clan is equal to the other clan
	 */
	equals(clan: ClanResultPreview<T>): clan is this {
		return (
			super.equals(clan) &&
			this.donationsPerWeek === clan.donationsPerWeek &&
			this.location.id === clan.location.id &&
			this.memberCount === clan.memberCount &&
			this.requiredTrophies === clan.requiredTrophies &&
			this.score === clan.score &&
			this.type === clan.type &&
			this.warTrophies === clan.warTrophies
		);
	}

	/**
	 * Patch this clan result preview
	 * @param data - The data to patch this clan result preview with
	 * @returns The patched clan result preview
	 */
	patch(data: Partial<T>): this {
		if (data.clanScore !== undefined) this.score = data.clanScore;
		if (data.clanWarTrophies !== undefined)
			this.warTrophies = data.clanWarTrophies;
		if (data.donationsPerWeek !== undefined)
			this.donationsPerWeek = data.donationsPerWeek;
		if (data.location !== undefined) this.location.patch(data.location);
		if (data.members !== undefined) this.memberCount = data.members;
		if (data.requiredTrophies !== undefined)
			this.requiredTrophies = data.requiredTrophies;
		if (data.type !== undefined) this.type = ClanType[data.type];

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this clan result preview
	 * @returns The JSON representation of this clan result preview
	 */
	toJson(): APIClanResultPreview {
		return {
			...super.toJson(),
			clanScore: this.score,
			clanWarTrophies: this.warTrophies,
			donationsPerWeek: this.donationsPerWeek,
			location: this.location.toJson(),
			members: this.memberCount,
			requiredTrophies: this.requiredTrophies,
			type: ClanType[this.type] as APIClanType,
		};
	}
}

export default ClanResultPreview;
