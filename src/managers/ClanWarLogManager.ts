import type ClientRoyale from "..";
import type { APIClanWarLog } from "..";
import Manager from "./Manager";

/**
 * A manager for clan war logs
 * @deprecated **The WarLog API endpoint has been temporarily disabled, possibilities to bring it back are being investigated.
 * Use {@link RiverRaceLogEntryManager} instead**
 */
export class ClanWarLogManager extends Manager<string, APIClanWarLog> {
	/**
	 * @param client - The client that instantiated this manager
	 */
	constructor(client: ClientRoyale) {
		super(client, {
			addEvent: "clanWarLogAdd",
			updateEvent: "clanWarLogUpdate",
		});
	}

	/**
	 * Retrieve clan's clan war log.
	 * @param _clanTag - Tag of the clan
	 * @returns The clan war log
	 * @throws {@link Error} - This API endpoint has been temporarily disabled, possibilities to bring it back are being investigated.
	 */
	fetch(_clanTag: string): never {
		throw new Error(
			"The WarLog API endpoint has been temporarily disabled, possibilities to bring it back are being investigated."
		);
	}
}

export default ClanWarLogManager;
