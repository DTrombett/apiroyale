import type ClientRoyale from "..";
import type { APIMember, APIRole, Arena, Clan, Player } from "..";
import { APIDateToObject, ClanMemberRole, dateObjectToAPIDate } from "../util";
import BasePlayer from "./BasePlayer";

/**
 * A clan member
 */
export class ClanMember<T extends APIMember = APIMember> extends BasePlayer<T> {
	/**
	 * The arena this member is currently in
	 */
	arena!: Arena;

	/**
	 * The clan of this member
	 */
	clan: Clan;

	/**
	 * The number of donations this member has made this week
	 */
	donationsPerWeek!: number;

	/**
	 * The number of donations this member has received this week
	 */
	donationsReceivedPerWeek!: number;

	/**
	 * The experience level of this member
	 */
	kingLevel!: number;

	/**
	 * When this member was last seen
	 */
	lastSeen!: Date;

	/**
	 * The previous rank of this member in the clan
	 */
	previousRank!: number;

	/**
	 * The rank of this member in the clan
	 */
	rank!: number;

	/**
	 * The role of this member
	 */
	role!: ClanMemberRole;

	/**
	 * The number of trophies this member has
	 */
	trophies!: number;

	/**
	 * @param client - The client that instantiated this clan member
	 * @param data - The data of the member
	 * @param clan - The clan of the member
	 */
	constructor(client: ClientRoyale, data: T, clan: Clan) {
		super(client, data);
		this.clan = clan;
		this.patch(data);
	}

	/**
	 * The contribution to the total donations of this member
	 */
	get donationPercentage(): number {
		return (this.donationsPerWeek / this.clan.donationsPerWeek) * 100;
	}

	/**
	 * This member as a player
	 */
	get player(): Player | null {
		return this.client.players.get(this.tag) ?? null;
	}

	/**
	 * The difference between the old and the new rank of this member
	 */
	get rankDifference(): number {
		return this.rank - this.previousRank;
	}

	/**
	 * Clone this member.
	 * @returns The cloned member
	 */
	clone(): ClanMember<T> {
		return new ClanMember(this.client, this.toJson(), this.clan);
	}

	/**
	 * Checks whether this member is equal to another member.
	 * @param member - The member to compare to
	 * @returns Whether the members are equal
	 */
	equals(member: ClanMember<T>): boolean {
		return (
			super.equals(member) &&
			this.arena.id === member.arena.id &&
			this.clan.tag === member.clan.tag &&
			this.donationsPerWeek === member.donationsPerWeek &&
			this.donationsReceivedPerWeek === member.donationsReceivedPerWeek &&
			this.kingLevel === member.kingLevel &&
			this.lastSeen.getTime() === member.lastSeen.getTime() &&
			this.previousRank === member.previousRank &&
			this.rank === member.rank &&
			this.role === member.role &&
			this.trophies === member.trophies
		);
	}

	/**
	 * Patches this member.
	 * @param data - The data to update this member with
	 * @returns The updated member
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.arena !== undefined)
			this.arena = this.client.arenas.add(data.arena);
		if (data.clanRank !== undefined) this.rank = data.clanRank;
		if (data.donations !== undefined) this.donationsPerWeek = data.donations;
		if (data.donationsReceived !== undefined)
			this.donationsReceivedPerWeek = data.donationsReceived;
		if (data.expLevel !== undefined) this.kingLevel = data.expLevel;
		if (data.lastSeen !== undefined)
			this.lastSeen = APIDateToObject(data.lastSeen);
		if (data.previousClanRank !== undefined)
			this.previousRank = data.previousClanRank;
		if (data.role !== undefined) this.role = ClanMemberRole[data.role];
		if (data.trophies !== undefined) this.trophies = data.trophies;

		if (!this.equals(old)) this.client.emit("clanMemberUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this member.
	 * @returns The JSON representation
	 */
	toJson(): APIMember {
		return {
			...super.toJson(),
			arena: this.arena.toJson(),
			donations: this.donationsPerWeek,
			donationsReceived: this.donationsReceivedPerWeek,
			expLevel: this.kingLevel,
			role: ClanMemberRole[this.role] as APIRole,
			trophies: this.trophies,
			clanChestPoints: 0,
			clanRank: this.rank,
			previousClanRank: this.previousRank,
			lastSeen: dateObjectToAPIDate(this.lastSeen),
		};
	}

	/**
	 * Gets the string representation of this member.
	 * @returns The name of this member
	 */
	toString(): string {
		return this.name;
	}
}

export default ClanMember;
