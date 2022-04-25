import type ClientRoyale from "..";
import type { APIArena } from "..";
import Manager from "./Manager";

/**
 * A manager for arenas
 */
export class ArenaManager extends Manager<number, APIArena> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, ...data: APIArena[]) {
		super(
			client,
			{
				addEvent: "arenaAdd",
				removeEvent: "arenaRemove",
				updateEvent: "arenaUpdate",
			},
			...data.map((arena) => [arena.id, arena] as const)
		);
	}
}

export default ArenaManager;
