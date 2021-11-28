import type ClientRoyale from "..";
import type { APIArena } from "..";
import { Arena } from "../structures";
import Manager from "./Manager";

/**
 * A manager for arenas
 */
export class ArenaManager extends Manager<typeof Arena> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIArena[]) {
		super(client, Arena, {
			addEvent: "newArena",
			data,
			removeEvent: "arenaRemove",
			updateEvent: "arenaUpdate",
		});
	}
}

export default ArenaManager;
