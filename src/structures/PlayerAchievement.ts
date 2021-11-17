import type { APIAchievement } from "..";
import type ClientRoyale from "..";
import Structure from "./Structure";

/**
 * A player's achievement
 */
export class PlayerAchievement extends Structure<APIAchievement> {
	static id = "name";

	/**
	 * The name of the achievement
	 */
	name: string;

	/**
	 * The progress of the achievement
	 */
	progress: number;

	/**
	 * The level of the achievement
	 */
	level: number;

	/**
	 * The target of the achievement
	 */
	target: number;

	/**
	 * Info about this achievement
	 */
	info: string;

	/**
	 * @param client - The client that instantiated this achievement
	 * @param data - The data of the achievement
	 */
	constructor(client: ClientRoyale, data: APIAchievement) {
		super(client, data);

		this.name = data.name;
		this.info = data.info;
		this.level = data.stars;
		this.target = data.target;
		this.progress = data.value;
	}

	/**
	 * The percentage of the achievement's progress
	 */
	get percentage(): number | null {
		return (this.progress / this.target) * 100;
	}

	/**
	 * The missing progress to reach the next target
	 */
	get missingProgress(): number | null {
		return this.target - this.progress;
	}

	/**
	 * Clone this achievement.
	 */
	clone<T extends PlayerAchievement>(): T;
	clone(): PlayerAchievement {
		return new PlayerAchievement(this.client, this.toJson());
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
	patch(data: Partial<APIAchievement>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name != null) this.name = data.name;
		if (data.info != null) this.info = data.info;
		if (data.stars != null) this.level = data.stars;
		if (data.target != null) this.target = data.target;
		if (data.value != null) this.progress = data.value;

		if (!this.equals(old))
			this.client.emit("playerAchievementUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this achievement.
	 */
	toJson<R extends APIAchievement = APIAchievement>(): R;
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
