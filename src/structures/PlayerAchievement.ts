import type { APIAchievement, Player } from "..";
import type ClientRoyale from "..";
import Structure from "./Structure";

/**
 * A player's achievement
 */
export class PlayerAchievement<
	T extends APIAchievement = APIAchievement
> extends Structure<T> {
	static id = "name" as const;

	/**
	 * Info about this achievement
	 */
	info!: string;

	/**
	 * The level of the achievement
	 */
	level!: number;

	/**
	 * The name of the achievement
	 */
	name!: string;

	/**
	 * The player that owns this achievement
	 */
	player: Player;

	/**
	 * The progress of the achievement
	 */
	progress!: number;

	/**
	 * The target of the achievement
	 */
	target!: number;

	/**
	 * @param client - The client that instantiated this achievement
	 * @param data - The data of the achievement
	 * @param player - The player that owns this achievement
	 */
	constructor(client: ClientRoyale, data: T, player: Player) {
		super(client, data);
		this.player = player;
		this.patch(data);
	}

	/**
	 * The missing progress to reach the next target
	 */
	get missingProgress(): number | null {
		return this.target - this.progress;
	}

	/**
	 * The percentage of the achievement's progress
	 */
	get percentage(): number | null {
		return (this.progress / this.target) * 100;
	}

	/**
	 * Clone this achievement.
	 */
	clone(): PlayerAchievement {
		return new PlayerAchievement(this.client, this.toJson(), this.player);
	}

	/**
	 * Checks whether this achievement is equal to another, comparing all properties.
	 * @param achievement - The achievement to compare to
	 */
	equals(achievement: PlayerAchievement): boolean {
		return (
			this.name === achievement.name &&
			this.progress === achievement.progress &&
			this.level === achievement.level &&
			this.target === achievement.target &&
			this.info === achievement.info
		);
	}

	/**
	 * Patch this achievement.
	 * @param data - The data to patch
	 * @returns The patched achievement
	 */
	patch(data: Partial<T>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name !== undefined) this.name = data.name;
		if (data.info !== undefined) this.info = data.info;
		if (data.stars !== undefined) this.level = data.stars;
		if (data.target !== undefined) this.target = data.target;
		if (data.value !== undefined) this.progress = data.value;

		if (!this.equals(old))
			this.client.emit("playerAchievementUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this achievement.
	 */
	toJson(): APIAchievement {
		return {
			name: this.name,
			completionInfo: null,
			stars: this.level,
			target: this.target,
			value: this.progress,
			info: this.info,
		};
	}

	/**
	 * Gets a string representation of this achievement.
	 * @returns The achievement's name
	 */
	toString(): string {
		return this.name;
	}
}

export default PlayerAchievement;
