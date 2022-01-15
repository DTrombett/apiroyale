import type ClientRoyale from "..";
import type {
	APIPlayer,
	APITag,
	FetchOptions,
	FetchPlayerUpcomingChestsOptions,
	Player,
} from "..";
import { UpcomingChestManager } from "../managers";
import Structure from "./Structure";

export type APIBasePlayer = Pick<APIPlayer, "name" | "tag">;

/**
 * Basic data about a player
 */
export class BasePlayer<
	T extends APIBasePlayer = APIBasePlayer
> extends Structure<T> {
	declare readonly id: APITag;

	/**
	 * The name of this player
	 */
	name: string;

	/**
	 * The tag of this player
	 */
	readonly tag: APITag;

	/**
	 * The player's upcoming chests
	 */
	readonly upcomingChests: UpcomingChestManager;

	/**
	 * @param client - The client that instantiated this player
	 * @param data - The data of the player
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data, data.tag);

		this.tag = data.tag;
		this.name = data.name;
		this.upcomingChests = new UpcomingChestManager(client);
	}

	/**
	 * Clone this player.
	 * @returns The cloned player
	 */
	clone(): BasePlayer<T> {
		return new BasePlayer(this.client, this.toJSON());
	}

	/**
	 * Check whether this player is equal to another player.
	 * @param player - The player to compare to
	 * @returns Whether the players are equal
	 */
	equals(player: BasePlayer<T>): player is this {
		return (
			super.equals(player) &&
			this.name === player.name &&
			this.tag === player.tag
		);
	}

	/**
	 * Fetch this player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new player
	 */
	fetch(options?: FetchOptions): Promise<Player> {
		return this.client.players.fetch(this.id, options);
	}

	/**
	 * Fetch this player's upcoming chests.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the player's upcoming chests
	 */
	fetchUpcomingChests(
		options: FetchPlayerUpcomingChestsOptions
	): Promise<UpcomingChestManager> {
		return this.upcomingChests.fetch(options);
	}

	/**
	 * Patch this player.
	 * @param data - The data to patch this player with
	 * @returns The patched player
	 */
	patch(data: Partial<T>): this {
		if (data.name !== undefined) this.name = data.name;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this player.
	 * @returns The JSON representation
	 */
	toJSON(): APIBasePlayer {
		return {
			...super.toJSON(),
			name: this.name,
			tag: this.tag,
		};
	}
}

export default BasePlayer;
