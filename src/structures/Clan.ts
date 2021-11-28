import { URLSearchParams } from "node:url";
import type {
	APIClan,
	APICurrentRiverRace,
	APIRiverRaceLog,
	ClientRoyale,
	FetchRiverRaceLogOptions,
} from "..";
import { RiverRaceLogResults } from "../lists";
import { ClanMemberManager, FinishedRiverRaceManager } from "../managers";
import { Routes } from "../util";
import ClanResultPreview from "./ClanResultPreview";
import CurrentRiverRace from "./CurrentRiverRace";

/**
 * A clan
 */
export class Clan<T extends APIClan = APIClan> extends ClanResultPreview<T> {
	/**
	 * The current river race of this clan
	 */
	currentRiverRace?: CurrentRiverRace;

	/**
	 * The description of the clan
	 */
	description!: string;

	/**
	 * The members of the clan
	 */
	readonly members: ClanMemberManager;

	/**
	 * The river race log of this clan
	 */
	readonly riverRaceLog: FinishedRiverRaceManager;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.members = new ClanMemberManager(client, this, data.memberList);
		this.riverRaceLog = new FinishedRiverRaceManager(client);
		this.patch({
			...data,
			memberList: undefined,
		});
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
	 * Fetch the current river race of this clan.
	 * @returns The current river race of this clan
	 */
	async fetchCurrentRiverRace(): Promise<CurrentRiverRace> {
		return (this.currentRiverRace = new CurrentRiverRace(
			this.client,
			await this.client.api.get<APICurrentRiverRace>(
				Routes.CurrentRiverRace(this.tag)
			)
		));
	}

	/**
	 * Fetch the river race log of this clan.
	 * @param options - Options for fetching the river race log
	 * @returns The river race log of this clan
	 */
	async fetchRiverRaceLog(
		options?: FetchRiverRaceLogOptions
	): Promise<RiverRaceLogResults> {
		const query = new URLSearchParams();

		if (options?.limit !== undefined) query.append("limit", `${options.limit}`);
		if (options?.after !== undefined) query.append("after", options.after);
		if (options?.before !== undefined) query.append("before", options.before);

		const log = await this.client.api.get<APIRiverRaceLog>(
			Routes.RiverRaceLog(this.tag),
			{ query }
		);

		this.riverRaceLog.add(...log.items);
		return new RiverRaceLogResults(this, options ?? {}, log);
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
