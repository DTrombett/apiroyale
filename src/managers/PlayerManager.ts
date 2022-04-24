import type ClientRoyale from "..";
import type { APIPlayer, FetchOptions } from "..";
import { Routes } from "../util";
import { Manager } from "./Manager";

/**
 * A manager for players
 */
export class PlayerManager extends Manager<APIPlayer["tag"], APIPlayer> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIPlayer[]) {
		super(
			client,
			{
				addEvent: "playerAdd",
				removeEvent: "playerRemove",
				updateEvent: "playerUpdate",
			},
			...data.map((player) => [player.tag, player] as const)
		);
	}

	/**
	 * Get information about a single player by player tag.
	 * Player tags can be found either in game or by from clan member lists.
	 * @param tag - Tag of the clan
	 * @returns The player
	 */
	async fetch(tag: string, options: FetchOptions = {}): Promise<APIPlayer> {
		const existing = this.get(tag);

		if (existing && options.force !== undefined && !this.isOutdated(tag))
			return existing;
		const player = await this.client.api.get(Routes.Player(tag));

		return this.add(player.data.tag, player.data, {
			maxAge: player.maxAge,
		});
	}
}

export default PlayerManager;
