import type ClientRoyale from "..";
import type { APIClan } from "..";
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
	constructor(
		client: ClientRoyale,
		data?: Omit<
			APIClan,
			"clanChestPoints" | "clanChestStatus" | "description" | "memberList"
		>[]
	) {
		super(client, ClanResultPreview, {
			addEvent: "newClanResultPreview",
			data,
			removeEvent: "clanResultPreviewRemove",
			sortMethod: (a, b) => b.score - a.score,
			updateEvent: "clanResultPreviewUpdate",
		});
	}
}

export default ClanResultPreviewManager;
