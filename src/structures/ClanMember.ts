import type ClientRoyale from "..";
import type { APIClanMember, APIRole, Arena, Clan, Player } from "..";
import { APIDateToObject, dateObjectToAPIDate } from "../util";
import BasePlayer from "./BasePlayer";

/**
 * A clan member
 */
export class ClanMember<
	T extends APIClanMember = APIClanMember
> extends BasePlayer<T> {
	/**
	 * The arena this member is currently in
	 */
	readonly arena: Arena;

	/**
	 * The clan of this member
	 */
	readonly clan: Clan;

	/**
	 * The number of donations this member has made this week
	 */
	donationsPerWeek: number;

	/**
	 * The number of donations this member has received this week
	 */
	donationsReceivedPerWeek: number;

	/**
	 * The experience level of this member
	 */
	kingLevel: number;

	/**
	 * When this member was last online
	 */
	lastSeen: Date;

	/**
	 * The previous rank of this member in the clan
	 */
	previousRank: number;

	/**
	 * The rank of this member in the clan
	 */
	rank: number;

	/**
	 * The role of this member
	 */
	role: APIRole;

	/**
	 * The number of trophies this member has
	 */
	trophies: number;

	/**
	 * @param client - The client that instantiated this clan member
	 * @param data - The data of the member
	 * @param clan - The clan of the member
	 */
	constructor(client: ClientRoyale, data: T, clan: Clan) {
		super(client, data);

		this.clan = clan;
		this.arena = this.client.arenas.add(data.arena);
		this.donationsPerWeek = data.donations;
		this.donationsReceivedPerWeek = data.donationsReceived;
		this.kingLevel = data.expLevel;
		this.lastSeen = APIDateToObject(data.lastSeen);
		this.previousRank = data.previousClanRank;
		this.rank = data.clanRank;
		this.role = data.role;
		this.trophies = data.trophies;
	}

	/**
	 * The contribution to the total clan donations of this member
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
		return new ClanMember(this.client, this.toJSON(), this.clan);
	}

	/**
	 * Check whether this member is equal to another member.
	 * @param member - The member to compare to
	 * @returns Whether the members are equal
	 */
	equals(member: ClanMember<T>): member is this {
		return (
			super.equals(member) &&
			this.arena.id === member.arena.id &&
			this.clan.id === member.clan.id &&
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
	 * Patch this member.
	 * @param member - The data to patch this member with
	 * @returns The patched member
	 */
	patch(member: Partial<T>): this {
		if (member.arena !== undefined) this.arena.patch(member.arena);
		if (member.clanRank !== undefined) this.rank = member.clanRank;
		if (member.donations !== undefined)
			this.donationsPerWeek = member.donations;
		if (member.donationsReceived !== undefined)
			this.donationsReceivedPerWeek = member.donationsReceived;
		if (member.expLevel !== undefined) this.kingLevel = member.expLevel;
		if (member.lastSeen !== undefined)
			this.lastSeen = APIDateToObject(member.lastSeen);
		if (member.previousClanRank !== undefined)
			this.previousRank = member.previousClanRank;
		if (member.role !== undefined) this.role = member.role;
		if (member.trophies !== undefined) this.trophies = member.trophies;

		return super.patch(member);
	}

	/**
	 * Get a JSON representation of this member.
	 * @returns The JSON representation
	 */
	toJSON(): APIClanMember {
		return {
			...super.toJSON(),
			arena: this.arena.toJSON(),
			clanChestPoints: 0,
			clanRank: this.rank,
			donations: this.donationsPerWeek,
			donationsReceived: this.donationsReceivedPerWeek,
			expLevel: this.kingLevel,
			lastSeen: dateObjectToAPIDate(this.lastSeen),
			previousClanRank: this.previousRank,
			role: this.role,
			trophies: this.trophies,
		};
	}
}

export default ClanMember;
