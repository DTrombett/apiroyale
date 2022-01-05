import type ClientRoyale from "..";
import type { APIClanPreview } from "..";
import { ClanPreview } from "../structures";
import Manager from "./Manager";

/**
 * A manager for clans current standings
 */
export class ClanPreviewManager extends Manager<typeof ClanPreview> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize this manager with
	 */
	constructor(client: ClientRoyale, data?: APIClanPreview[]) {
		super(client, ClanPreview, {
			addEvent: "newClanPreview",
			data,
			removeEvent: "clanPreviewRemove",
			sortMethod: (a, b) => a.name.localeCompare(b.name),
			updateEvent: "clanPreviewUpdate",
		});
	}
}

export default ClanPreviewManager;
