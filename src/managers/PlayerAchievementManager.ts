import type ClientRoyale from "..";
import type { APIAchievement } from "..";
import type { Player } from "../structures";
import { PlayerAchievement } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player achievements
 */
export class PlayerAchievementManager extends Manager<
	typeof PlayerAchievement
> {
	/**
	 * The player that this manager belongs to
	 */
	player: Player;

	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIAchievement[]) {
		super(client, PlayerAchievement, data);

		this.player = player;
	}

	/**
	 * Adds a structure to this manager.
	 * @param data - The data of the structure to add
	 * @returns The added structure
	 */
	add<S extends PlayerAchievement = PlayerAchievement>(
		data: APIAchievement
	): S {
		const existing = this.get(data[PlayerAchievement.id]) as S | undefined;
		if (existing != null) return existing.patch(data);
		const achievement = new PlayerAchievement(
			this.client,
			data,
			this.player
		) as S;
		this.set(achievement.id, achievement);
		this.client.emit("structureAdd", achievement);
		return achievement;
	}

	/**
	 * Removes an achievement from the manager.
	 * @param name - The name of the achievement to remove
	 * @returns The removed achievement, if it exists
	 */
	remove(name: string): PlayerAchievement | undefined {
		return super.remove(name);
	}
}

export default PlayerAchievementManager;
