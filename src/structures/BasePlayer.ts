import type ClientRoyale from "..";
import type { APIPlayer, APITag, FetchOptions, Path, Player } from "..";
import FetchableStructure from "./FetchableStructure";

export type APIBasePlayer = Pick<APIPlayer, "name" | "tag">;

/**
 * Basic data about a player
 */
export class BasePlayer<
	T extends APIBasePlayer = APIBasePlayer
> extends FetchableStructure<T> {
	static route: Path = "/players/:id";
	static id = "tag" as const;

	/**
	 * The name of this player
	 */
	name!: string;

	/**
	 * The tag of this player
	 */
	readonly tag: APITag;

	/**
	 * @param client - The client that instantiated this clan player
	 * @param data - The data of the player
	 */
	constructor(client: ClientRoyale, data: T) {
		super(client, data);
		this.tag = data.tag;
		this.patch(data);
	}

	/**
	 * Clone this player.
	 * @returns The cloned player
	 */
	clone(): BasePlayer<T> {
		return new BasePlayer(this.client, this.toJson());
	}

	/**
	 * Checks whether this player is equal to another player.
	 * @param player - The player to compare to
	 * @returns Whether the players are equal
	 */
	equals(player: BasePlayer<T>): boolean {
		return (
			super.equals(player) &&
			this.tag === player.tag &&
			this.name === player.name
		);
	}

	/**
	 * Fetches this player.
	 * @param options - The options for the fetch
	 * @returns A promise that resolves with the new player
	 */
	fetch(options?: FetchOptions): Promise<Player> {
		return this.client.players.fetch(this.tag, options);
	}

	/**
	 * Patches this player.
	 * @param data - The data to update this player with
	 * @returns The updated player
	 */
	patch(data: Partial<T>): this {
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;

		return this;
	}

	/**
	 * Gets a JSON representation of this player.
	 * @returns The JSON representation
	 */
	toJson(): APIBasePlayer {
		return {
			name: this.name,
			tag: this.tag,
		};
	}

	/**
	 * Gets the string representation of this player.
	 * @returns The name of this player
	 */
	toString(): string {
		return this.name;
	}
}

export default BasePlayer;
