import type ClientRoyale from "..";
import type { APIAchievement, Player } from "..";
import Structure from "./Structure";

/**
 * A player's achievement
 */
export class PlayerAchievement<
	T extends APIAchievement = APIAchievement
> extends Structure<T> {
	/**
	 * Info about this achievement
	 */
	info: string;

	/**
	 * The level of the achievement
	 */
	level: number;

	/**
	 * The name of the achievement
	 */
	readonly name: string;

	/**
	 * The player that owns this achievement
	 */
	readonly player: Player;

	/**
	 * The progress of the achievement
	 */
	progress: number;

	/**
	 * The target of the achievement
	 */
	target: number;

	/**
	 * @param client - The client that instantiated this achievement
	 * @param data - The data of the achievement
	 * @param player - The player that owns this achievement
	 */
	constructor(client: ClientRoyale, data: T, player: Player) {
		super(client, data, data.name);

		this.player = player;
		this.name = data.name;
		this.info = data.info;
		this.level = data.stars;
		this.progress = data.value;
		this.target = data.target;
	}

	/**
	 * If the player has completed this achievement
	 */
	get completed(): boolean {
		return this.progress >= this.target;
	}

	/**
	 * The missing progress to reach the next target
	 */
	get missingProgress(): number {
		return this.target - this.progress;
	}

	/**
	 * The percentage of the achievement's progress
	 */
	get percentage(): number {
		return (this.progress / this.target) * 100;
	}

	/**
	 * Clone this achievement.
	 * @returns The cloned achievement
	 */
	clone(): PlayerAchievement {
		return new PlayerAchievement(this.client, this.toJson(), this.player);
	}

	/**
	 * Check whether this achievement is equal to another.
	 * @param achievement - The achievement to compare to
	 * @returns Whether the achievements are equal
	 */
	equals(achievement: PlayerAchievement): achievement is this {
		return (
			this.info === achievement.info &&
			this.level === achievement.level &&
			this.name === achievement.name &&
			this.player.id === achievement.player.id &&
			this.progress === achievement.progress &&
			this.target === achievement.target
		);
	}

	/**
	 * Patch this achievement.
	 * @param data - The data to patch this achievement with
	 * @returns The patched achievement
	 */
	patch(data: Partial<T>): this {
		if (data.info !== undefined) this.info = data.info;
		if (data.stars !== undefined) this.level = data.stars;
		if (data.target !== undefined) this.target = data.target;
		if (data.value !== undefined) this.progress = data.value;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this achievement.
	 * @returns The JSON representation of this achievement
	 */
	toJson(): APIAchievement {
		return {
			...super.toJson(),
			completionInfo: null,
			info: this.info,
			name: this.name,
			stars: this.level,
			target: this.target,
			value: this.progress,
		};
	}
}

export default PlayerAchievement;
