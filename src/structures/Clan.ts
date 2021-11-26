import { URLSearchParams } from "node:url";
import { CurrentRiverRace } from "..";
import type {
	APIClan,
	APICurrentRiverRace,
	APIRiverRaceLog,
	ClientRoyale,
	FetchRiverRaceLogOptions,
} from "..";
import { RiverRaceLogResults } from "../lists";
import { ClanMemberManager, FinishedRiverRaceManager } from "../managers";
import ClanResultPreview from "./ClanResultPreview";

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
	members: ClanMemberManager;

	/**
	 * The river race log of this clan
	 */
	riverRaceLog: FinishedRiverRaceManager;

	/**
	 * @param client - The client that instantiated this clan
	 * @param data - The data of the clan
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.members = new ClanMemberManager(client, this);
		this.riverRaceLog = new FinishedRiverRaceManager(client);
		this.patch(data);
	}

	/**
	 * Clone this clan.
	 * @returns A clone of this clan
	 */
	clone(): Clan<T> {
		return new Clan(this.client, this.toJson());
	}

	/**
	 * Checks whether this clan is equal to another clan.
	 * @param other - The clan to compare to
	 * @returns Whether the clans are equal
	 */
	equals(other: Clan<T>): boolean {
		return (
			super.equals(other) &&
			this.description === other.description &&
			this.members.every((member) => other.members.has(member.tag))
		);
	}

	/**
	 * Fetch the current river race for this clan.
	 * @returns The current river race of this clan
	 */
	async fetchCurrentRiverRace(): Promise<CurrentRiverRace> {
		const riverRace = await this.client.api.get<APICurrentRiverRace>(
			`/clans/${this.tag}/currentriverrace`
		);
		return (this.currentRiverRace = new CurrentRiverRace(
			this.client,
			riverRace
		));
	}

	/**
	 * Fetch the river race log of this clan.
	 * @param options - Options for fetching the river race log
	 * @returns The river race log for this clan
	 */
	async fetchRiverRaceLog(
		options?: FetchRiverRaceLogOptions
	): Promise<RiverRaceLogResults> {
		const query = new URLSearchParams();

		if (options?.limit !== undefined)
			query.append("limit", options.limit.toString());
		if (options?.after !== undefined) query.append("after", options.after);
		if (options?.before !== undefined) query.append("before", options.before);

		const results = await this.client.api.get<APIRiverRaceLog>(
			`/clans/${this.tag}/riverracelog`,
			{ query }
		);
		for (const race of results.items) this.riverRaceLog.add(race);
		return new RiverRaceLogResults(this, options ?? {}, results);
	}

	/**
	 * Patches this clan.
	 * @param data - The data to update this clan with
	 * @returns The updated clan
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.description !== undefined) this.description = data.description;
		if (data.memberList !== undefined)
			for (const member of data.memberList) this.members.add(member);

		if (!this.equals(old)) this.client.emit("clanUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this clan.
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
