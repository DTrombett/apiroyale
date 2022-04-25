import type ClientRoyale from "..";
import type { APIGameMode } from "..";
import Manager from "./Manager";

/**
 * A manager for game modes
 */
export class GameModeManager extends Manager<number, APIGameMode> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIGameMode[]) {
		super(
			client,
			{
				addEvent: "gameModeAdd",
				removeEvent: "gameModeRemove",
				updateEvent: "gameModeUpdate",
			},
			...data.map((mode) => [mode.id, mode] as const)
		);
	}
}

export default GameModeManager;
