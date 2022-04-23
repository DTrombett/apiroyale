import type { APIClan, APIClanType, ClientRoyale } from "..";
import ClanPreview from "./ClanPreview";
import type Location from "./Location";

/**
 * A clan result preview
 */
export class ClanResultPreview<
	T extends Omit<
		APIClan,
		"clanChestPoints" | "clanChestStatus" | "description" | "memberList"
	> = Omit<
		APIClan,
		"clanChestPoints" | "clanChestStatus" | "description" | "memberList"
	>
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
	type: APIClanType;

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

		this.location = client.locations.add(data.location);
		this.donationsPerWeek = data.donationsPerWeek;
		this.memberCount = data.members;
		this.requiredTrophies = data.requiredTrophies;
		this.score = data.clanScore;
		this.type = data.type;
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
		return new ClanResultPreview(this.client, this.toJSON() as T);
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
		if (data.type !== undefined) this.type = data.type;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this clan result preview
	 * @returns The JSON representation of this clan result preview
	 */
	toJSON(): Omit<
		APIClan,
		"clanChestPoints" | "clanChestStatus" | "description" | "memberList"
	> {
		return {
			...super.toJSON(),
			clanScore: this.score,
			clanWarTrophies: this.warTrophies,
			donationsPerWeek: this.donationsPerWeek,
			location: this.location.toJSON(),
			members: this.memberCount,
			requiredTrophies: this.requiredTrophies,
			type: this.type,
			badgeId: this.badgeId,
			clanChestLevel: 0,
			clanChestMaxLevel: 0,
		};
	}
}

export default ClanResultPreview;
