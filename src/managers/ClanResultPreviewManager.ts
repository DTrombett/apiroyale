import type ClientRoyale from "..";
import type { APIClanResultPreview } from "..";
import { ClanResultPreview } from "../structures";
import Manager from "./Manager";

/**
 * A manager for clan result previews
 */
export class ClanResultPreviewManager extends Manager<
	typeof ClanResultPreview
> {
	/**
	 * @param client - The client that instantiated this manager
	 * @param data - The data to initialize the manager with
	 */
	constructor(client: ClientRoyale, data?: APIClanResultPreview[]) {
		super(client, ClanResultPreview, {
			addEvent: "newClanResultPreview",
			data,
			removeEvent: "clanResultPreviewRemove",
			updateEvent: "clanResultPreviewUpdate",
		});
	}
}

export default ClanResultPreviewManager;
