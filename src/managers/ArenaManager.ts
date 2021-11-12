import type ClientRoyale from "..";
import type { APIArena, StringId } from "..";
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
		super(client, Arena, data);
	}

	/**
	 * Removes an arena from the manager.
	 * @param id - The id of the arena to remove
	 * @returns The removed arena, if it exists
	 */
	remove(id: StringId): Arena | undefined {
		return super.remove(id);
	}
}

export default ArenaManager;
