import type ClientRoyale from "..";
import type { APIAchievement, Player } from "..";
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
	 * @param player - The player that this manager belongs to
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, player: Player, data?: APIAchievement[]) {
		super(
			client,
			PlayerAchievement,
			{
				addEvent: "newAchievement",
				data,
				removeEvent: "achievementRemove",
				sortMethod: (a, b) =>
					b.level - a.level ||
					b.percentage - a.percentage ||
					b.progress - a.progress ||
					a.name.localeCompare(b.name),
				updateEvent: "achievementUpdate",
			},
			player
		);

		this.player = player;
	}
}

export default PlayerAchievementManager;
