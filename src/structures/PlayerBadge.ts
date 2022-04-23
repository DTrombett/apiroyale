import type ClientRoyale from "..";
import type {
	APIPlayerAchievementBadge,
	NonNullableProperties,
	Player,
} from "..";
import Structure from "./Structure";

export type PlayerMultipleLevelsBadge<T extends PlayerBadge = PlayerBadge> =
	NonNullableProperties<T, "target">;

/**
 * A player's badge
 */
export class PlayerBadge<
	T extends APIPlayerAchievementBadge = APIPlayerAchievementBadge
> extends Structure<T> {
	/**
	 * The icon URLs of this badge
	 */
	iconUrls: APIPlayerAchievementBadge["iconUrls"];

	/**
	 * The current level of the badge
	 */
	level: number;

	/**
	 * The number of levels of the badge
	 */
	levels: number;

	/**
	 * The name of the badge
	 */
	readonly name: string;

	/**
	 * The player that owns this badge
	 */
	readonly player: Player;

	/**
	 * The progress of the badge
	 */
	progress: number;

	/**
	 * The target of the badge
	 */
	target: number;

	/**
	 * @param client - The client that instantiated this badge
	 * @param data - The data of the badge
	 * @param player - The player that owns this badge
	 */
	constructor(client: ClientRoyale, data: T, player: Player) {
		super(client, data, data.name);

		this.player = player;
		this.name = data.name;
		this.iconUrls = data.iconUrls;
		this.progress = data.progress;
		this.levels = data.maxLevel;
		this.level = data.level;
		this.target = data.target;
	}

	/**
	 * The number of levels missing to reach the maximum
	 */
	get missingLevels(): number {
		return this.levels - this.level;
	}

	/**
	 * The percentage of the badge's progress, or null if there is no data
	 */
	get percentage(): number {
		return (this.progress / this.target) * 100;
	}

	/**
	 * The missing progress to reach the next target, or null if there is no data
	 */
	get missingProgress(): number {
		return this.target - this.progress;
	}

	/**
	 * Clone this badge.
	 * @returns The cloned badge
	 */
	clone(): PlayerBadge {
		return new PlayerBadge(this.client, this.toJSON(), this.player);
	}

	/**
	 * Check whether this badge is equal to another.
	 * @param badge - The badge to compare to
	 */
	equals(badge: PlayerBadge): badge is this {
		return (
			super.equals(badge) &&
			this.level === badge.level &&
			this.levels === badge.levels &&
			this.name === badge.name &&
			this.player.id === badge.player.id &&
			this.progress === badge.progress &&
			this.target === badge.target
		);
	}

	/**
	 * Check if this badge has multiple levels.
	 * @returns Whether this badge has multiple levels
	 */
	isMultipleLevels(): this is PlayerMultipleLevelsBadge<this> {
		return this.levels > 1;
	}

	/**
	 * Patch this badge.
	 * @param data - The data to patch this badge with
	 * @returns The patched badge
	 */
	patch(data: Partial<T>): this {
		if (data.progress !== undefined) this.progress = data.progress;
		if (data.maxLevel !== undefined) this.levels = data.maxLevel;
		if (data.level !== undefined) this.level = data.level;
		if (data.target !== undefined) this.target = data.target;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this badge.
	 * @returns The JSON representation of this badge
	 */
	toJSON(): APIPlayerAchievementBadge {
		return {
			name: this.name,
			progress: this.progress,
			maxLevel: this.levels,
			level: this.level,
			target: this.target,
			iconUrls: this.iconUrls,
		};
	}
}

export default PlayerBadge;
