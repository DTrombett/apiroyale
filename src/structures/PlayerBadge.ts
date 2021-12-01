import type ClientRoyale from "..";
import type {
	APIBadge,
	APIMultipleLevelsBadge,
	NonNullableProperties,
	Player,
} from "..";
import Structure from "./Structure";

export type PlayerMultipleLevelsBadge<T extends PlayerBadge = PlayerBadge> =
	NonNullableProperties<T, "target">;

/**
 * A player's badge
 */
export class PlayerBadge<T extends APIBadge = APIBadge> extends Structure<T> {
	/**
	 * The current level of the badge
	 */
	level = 1;

	/**
	 * The number of levels of the badge
	 */
	levels = 1;

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
	target?: number;

	/**
	 * @param client - The client that instantiated this badge
	 * @param data - The data of the badge
	 * @param player - The player that owns this badge
	 */
	constructor(client: ClientRoyale, data: T, player: Player) {
		super(client, data, data.name);

		this.player = player;
		this.name = data.name;
		this.progress = data.progress;
		if ("maxLevel" in data) this.levels = data.maxLevel;
		if ("level" in data) this.level = data.level;
		if ("target" in data) this.target = data.target;
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
	get percentage(): number | null {
		return this.target != null ? (this.progress / this.target) * 100 : null;
	}

	/**
	 * The missing progress to reach the next target, or null if there is no data
	 */
	get missingProgress(): number | null {
		return this.target != null ? this.target - this.progress : null;
	}

	/**
	 * Clone this badge.
	 * @returns The cloned badge
	 */
	clone(): PlayerBadge {
		return new PlayerBadge(this.client, this.toJson(), this.player);
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
		if ((data as Partial<APIMultipleLevelsBadge>).maxLevel !== undefined)
			this.levels = (data as unknown as APIMultipleLevelsBadge).maxLevel;
		if ((data as Partial<APIMultipleLevelsBadge>).level !== undefined)
			this.level = (data as unknown as APIMultipleLevelsBadge).level;
		if ((data as Partial<APIMultipleLevelsBadge>).target !== undefined)
			this.target = (data as unknown as APIMultipleLevelsBadge).target;

		return super.patch(data);
	}

	/**
	 * Get a JSON representation of this badge.
	 * @returns The JSON representation of this badge
	 */
	toJson(): APIBadge {
		return {
			name: this.name,
			progress: this.progress,
			...(this.isMultipleLevels()
				? {
						maxLevel: this.levels,
						level: this.level,
						target: this.target,
				  }
				: {}),
		};
	}
}

export default PlayerBadge;
