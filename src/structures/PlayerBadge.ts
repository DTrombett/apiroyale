import type {
	APIBadge,
	APIMultipleLevelsBadge,
	NonNullableProperties,
} from "..";
import type ClientRoyale from "..";
import Structure from "./Structure";

export type PlayerMultipleLevelsBadge<T extends PlayerBadge = PlayerBadge> =
	NonNullableProperties<T, "level" | "levels" | "target">;

/**
 * A player's badge
 */
export class PlayerBadge extends Structure<APIBadge> {
	static id = "name";

	/**
	 * The name of the badge
	 */
	name: string;

	/**
	 * The progress of the badge
	 */
	progress: number;

	/**
	 * The number of levels of the badge
	 */
	levels?: number;

	/**
	 * The level of the badge
	 */
	level?: number;

	/**
	 * The target of the badge
	 */
	target?: number;

	/**
	 * @param client - The client that instantiated this badge
	 * @param data - The data of the badge
	 */
	constructor(client: ClientRoyale, data: APIBadge) {
		super(client, data);

		this.name = data.name;
		this.progress = data.progress;

		if ("maxLevel" in data) {
			this.levels = data.maxLevel;
			this.level = data.level;
			this.target = data.target;
		}
	}

	/**
	 * The number of levels missing to reach the maximum, or null if there is no data
	 */
	get missingLevels(): number | null {
		return this.levels != null && this.level != null
			? this.levels - this.level
			: null;
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
	 */
	clone<T extends PlayerBadge>(): T;
	clone(): PlayerBadge {
		return new PlayerBadge(this.client, this.toJson());
	}

	/**
	 * Checks whether this badge is equal to another, comparing all properties.
	 * @param badge - The badge to compare to
	 */
	equals(badge: PlayerBadge): boolean {
		return (
			this.name === badge.name &&
			this.progress === badge.progress &&
			this.levels === badge.levels &&
			this.level === badge.level &&
			this.target === badge.target
		);
	}

	/**
	 * Checks if this badge has multiple levels.
	 */
	isMultipleLevels(): this is PlayerMultipleLevelsBadge<this> {
		return this.levels != null;
	}

	/**
	 * Patch this badge.
	 * @param data - The data to patch
	 * @returns The patched badge
	 */
	patch(data: APIMultipleLevelsBadge): PlayerMultipleLevelsBadge<this> & this;
	patch(data: Partial<APIBadge>): this;
	patch(data: Partial<APIBadge>): this {
		const old = this.clone();
		super.patch(data);

		if (data.name != null) this.name = data.name;
		if (data.progress != null) this.progress = data.progress;

		if ("maxLevel" in data) {
			if (data.maxLevel != null) this.levels = data.maxLevel;
			if (data.level != null) this.level = data.level;
			if (data.target != null) this.target = data.target;
		}

		if (!this.equals(old)) this.client.emit("playerBadgeUpdate", old, this);
		return this;
	}

	/**
	 * Gets a JSON representation of this badge.
	 */
	toJson<R extends APIBadge = APIBadge>(): R;
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

	/**
	 * Gets a string representation of this badge.
	 * @returns The badge's name
	 */
	toString(): string {
		return this.name;
	}
}

export default PlayerBadge;
