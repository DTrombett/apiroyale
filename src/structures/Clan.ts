import type {
	APIClan,
	APIClanPreview,
	APIClanResultPreview,
	APITag,
	ClanMember,
	ClientRoyale,
	FetchOptions,
	Path,
	NonNullableProperties,
} from "..";
import { ClanMemberManager } from "../managers";
import { ClanType, getEnumString } from "../util";
import FetchableStructure from "./FetchableStructure";
import Location from "./Location";

export type ClanConstructor = APIClan | APIClanPreview | APIClanResultPreview;
export type ClanResultPreview<C extends Clan = Clan> = NonNullableProperties<
	C,
	| "donationsPerWeek"
	| "location"
	| "memberCount"
	| "requiredTrophies"
	| "score"
	| "type"
	| "warTrophies"
>;
export type NonPartialClan<C extends Clan = Clan> = NonNullableProperties<
	C,
	keyof C
>;

/**
 * A class representing a clan
 */
export class Clan extends FetchableStructure<ClanConstructor> {
	static route: Path = "/clans/:id";

	/**
	 * The badge ID of the clan
	 */
	badge: number;

	/**
	 * The description of the clan
	 */
	description?: string;

	/**
	 * The clan's donations per week
	 */
	donationsPerWeek?: number;

	/**
	 * The location of the clan
	 */
	location?: Location;

	/**
	 * The clan's member count
	 */
	memberCount?: number;

	/**
	 * The members of the clan
	 */
	members: ClanMemberManager;

	/**
	 * The name of the clan
	 */
	name: string;

	/**
	 * The required trophies to join the clan
	 */
	requiredTrophies?: number;

	/**
	 * The clan's score
	 */
	score?: number;

	/**
	 * The tag of the clan
	 */
	readonly tag: APITag;

	/**
	 * The type of the clan
	 */
	type?: ClanType;

	/**
	 * The clan's trophies in the war
	 */
	warTrophies?: number;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: ClanConstructor) {
		super(client, data);

		this.tag = data.tag;
		this.name = data.name;
		if ("type" in data) this.type = ClanType[data.type];
		if ("description" in data) this.description = data.description;
		this.badge = data.badgeId;
		if ("clanScore" in data) this.score = data.clanScore;
		if ("clanWarTrophies" in data) this.warTrophies = data.clanWarTrophies;
		if ("location" in data) this.location = new Location(client, data.location);
		if ("requiredTrophies" in data)
			this.requiredTrophies = data.requiredTrophies;
		if ("donationsPerWeek" in data)
			this.donationsPerWeek = data.donationsPerWeek;
		this.members = new ClanMemberManager(
			client,
			this,
			"memberList" in data ? data.memberList : undefined
		);
		if ("members" in data) this.memberCount = data.members;
	}

	/**
	 * The location name of this clan
	 */
	get locationName() {
		return this.location?.name;
	}

	/**
	 * Clone this clan.
	 */
	clone(): Clan {
		return new Clan(this.client, this.toJson());
	}

	/**
	 * Checks whether this clan is equal to another clan, comparing all properties.
	 * @param other - The clan to compare to
	 * @returns Whether the clans are equal
	 */
	equals(other: Clan): boolean {
		const mapMembers = (member: ClanMember): APITag => member.tag;

		return (
			super.equals(other) &&
			this.name === other.name &&
			this.type === other.type &&
			this.description === other.description &&
			this.badge === other.badge &&
			this.score === other.score &&
			this.warTrophies === other.warTrophies &&
			((this.location &&
				other.location &&
				this.location.equals(other.location)) ||
				(!this.location && !other.location)) &&
			this.requiredTrophies === other.requiredTrophies &&
			this.donationsPerWeek === other.donationsPerWeek &&
			this.members
				.mapValues(mapMembers)
				.equals(other.members.mapValues(mapMembers))
		);
	}

	/**
	 * Checks if this clan is from a search result.
	 * Note that this is meant to be a typeguard so will return `false` ONLY if the clan is not from a user clan preview.
	 */
	isSearchResult(): this is ClanResultPreview<this> {
		return this.score !== undefined;
	}

	/**
	 * Checks if this clan isn't partial, so it has all properties.
	 */
	isNotPartial(): this is NonPartialClan<this> {
		return this.description !== undefined;
	}

	/**
	 * Patches this clan.
	 * @param data - The data to update this clan with
	 * @returns The updated clan
	 */
	patch(data: APIClan): NonPartialClan<this> & this;
	patch(data: APIClanResultPreview): ClanResultPreview<this> & this;
	patch(data: Partial<APIClan>): this;
	patch(data: Partial<APIClan>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.type) this.type = ClanType[data.type];
		if (data.description !== undefined) this.description = data.description;
		if (data.badgeId !== undefined) this.badge = data.badgeId;
		if (data.clanScore !== undefined) this.score = data.clanScore;
		if (data.clanWarTrophies !== undefined)
			this.warTrophies = data.clanWarTrophies;
		if (data.location) this.location = new Location(this.client, data.location);
		if (data.requiredTrophies !== undefined)
			this.requiredTrophies = data.requiredTrophies;
		if (data.donationsPerWeek !== undefined)
			this.donationsPerWeek = data.donationsPerWeek;
		if (data.memberList)
			for (const member of data.memberList) this.members.add(member);

		if (!this.equals(old)) this.client.emit("clanUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJson(): ClanConstructor {
		return {
			...super.toJson(),
			badgeId: this.badge,
			clanScore: this.score,
			clanWarTrophies: this.warTrophies,
			description: this.description,
			donationsPerWeek: this.donationsPerWeek,
			location: this.location?.toJson(),
			name: this.name,
			requiredTrophies: this.requiredTrophies,
			tag: this.tag,
			type: this.type ? getEnumString(ClanType, this.type) : undefined,
			memberList: this.members.map((member) => member.toJson()),
			members: this.memberCount,
		};
	}

	/**
	 * Gets a string representation of this clan.
	 * @returns The name of this clan
	 */
	toString(): string {
		return this.name;
	}

	/**
	 * Fetches this clan.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new clan
	 */
	fetch(options?: FetchOptions) {
		return this.client.clans.fetch<this>(this.tag, options);
	}
}

export default Clan;
