import type ClientRoyale from "..";
import type { APIChallenge, StructureOptions } from "..";
import Manager from "./Manager";

/**
 * A manager for challenges
 */
export class ChallengeManager extends Manager<number, APIChallenge> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIChallenge[]) {
		super(
			client,
			{
				addEvent: "challengeAdd",
				removeEvent: "challengeRemove",
				updateEvent: "challengeUpdate",
			},
			...data.map((challenge) => [challenge.id, challenge] as const)
		);
	}

	add<T extends APIChallenge>(
		key: number,
		value: T,
		options?: StructureOptions
	): T {
		if (options?.cacheNested ?? this.client.defaults.defaultCacheNested)
			this.client.gameModes.add(value.gameMode.id, value.gameMode, options);
		return super.add(key, value, options);
	}
}

export default ChallengeManager;
