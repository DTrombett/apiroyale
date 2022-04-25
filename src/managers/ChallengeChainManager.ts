import type ClientRoyale from "..";
import type {
	APIChallengeChain,
	APIChallengeChainsList,
	FetchOptions,
} from "..";
import { Routes } from "../util";
import { Manager } from "./Manager";

/**
 * A manager for challenge chains
 */
export class ChallengeChainManager extends Manager<
	APIChallengeChain["startTime"],
	APIChallengeChain
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIChallengeChain[]) {
		super(
			client,
			{
				addEvent: "challengeChainAdd",
				removeEvent: "challengeChainRemove",
				updateEvent: "challengeChainUpdate",
			},
			...data.map((challenge) => [challenge.startTime, challenge] as const)
		);
	}

	/**
	 * Get current and upcoming challenges.
	 * Challenges are returned as chains.
	 * @param options - Options for the request
	 * @returns The challenge chains
	 */
	async fetch(options: FetchOptions): Promise<APIChallengeChainsList> {
		const existing = this.last();

		if (
			existing &&
			options.force !== true &&
			!this.isOutdated(existing.startTime)
		)
			return this.array();
		const challenges = await this.client.api.get(Routes.Challenges());

		for (const challenge of challenges.data)
			this.add(challenge.startTime, challenge, { maxAge: challenges.maxAge });
		return challenges.data;
	}
}

export default ChallengeChainManager;
