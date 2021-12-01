import type { APIClan, ClientRoyale } from "..";
import { ClanMemberManager } from "../managers";
import ClanResultPreview from "./ClanResultPreview";

/**
 * A clan
 */
export class Clan<T extends APIClan = APIClan> extends ClanResultPreview<T> {
	/**
	 * The description of the clan
	 */
	description: string;

	/**
	 * The members of the clan
	 */
	readonly members: ClanMemberManager;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);

		this.members = new ClanMemberManager(client, this, data.memberList);
		this.description = data.description;
	}

	/**
	 * Clone this clan.
	 * @returns The cloned clan
	 */
	clone(): Clan<T> {
		return new Clan(this.client, this.toJson());
	}

	/**
	 * Check whether this clan is equal to another clan.
	 * @param clan - The clan to compare to
	 * @returns Whether the clans are equal
	 */
	equals(clan: Clan<T>): clan is this {
		return (
			super.equals(clan) &&
			this.description === clan.description &&
			this.members.equals(clan.members)
		);
	}

	/**
	 * Patch this clan.
	 * @param data - The data to patch this clan with
	 * @returns The patched clan
	 */
	patch(data: Partial<T>): this {
		if (data.description !== undefined) this.description = data.description;
		if (data.memberList !== undefined)
			this.members.overrideItems(data.memberList);

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this clan.
	 * @returns The JSON representation of this clan
	 */
	toJson(): APIClan {
		return {
			...super.toJson(),
			description: this.description,
			memberList: this.members.map((member) => member.toJson()),
			clanChestLevel: 1,
			clanChestMaxLevel: 0,
			clanChestStatus: "inactive",
		};
	}
}

export default Clan;
