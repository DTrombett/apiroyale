import type ClientRoyale from "..";
import type { APIAchievement } from "..";
import { PlayerAchievement } from "../structures";
import Manager from "./Manager";

/**
 * A manager for player achievements
 */
export class PlayerAchievementManager extends Manager<
	typeof PlayerAchievement
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIAchievement[]) {
		super(client, PlayerAchievement, data);
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
