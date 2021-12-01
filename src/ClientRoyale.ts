import EventEmitter from "node:events";
import {
	ArenaManager,
	CardManager,
	ClanManager,
	ClanPreviewManager,
	CurrentRiverRaceManager,
	LocationManager,
	PlayerManager,
} from "./managers";
import Rest from "./rest";
import type { ClientEvents, ClientOptions } from "./util";
import { Errors } from "./util";

/**
 * A class to connect to the Clash Royale API
 */
export interface ClientRoyale extends EventEmitter {
	on: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	once: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	addListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	removeListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	off: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	prependOnListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	prependOnceListener: <T extends keyof ClientEvents>(
		event: T,
		listener: (...args: ClientEvents[T]) => any
	) => this;
	emit<T extends keyof ClientEvents>(
		event: T,
		...args: ClientEvents[T]
	): boolean;
}

/**
 * A class to connect to the Clash Royale API
 */
export class ClientRoyale extends EventEmitter {
	/**
	 * The rest client
	 */
	api = new Rest(this);

	/**
	 * A manager for arenas
	 */
	arenas = new ArenaManager(this);

	/**
	 * A manager of cards
	 */
	cards = new CardManager(this);

	/**
	 * A manager of clan previews
	 * This will be more populated than {@link ClientRoyale.clans} as it's updated with player clans info too
	 */
	clanPreviews = new ClanPreviewManager(this);

	/**
	 * A manager for clans
	 */
	clans = new ClanManager(this);

	/**
	 * A manager for locations
	 */
	locations = new LocationManager(this);

	/**
	 * A manager for players
	 */
	players = new PlayerManager(this);

	/**
	 * A manager for clans current river races
	 */
	races = new CurrentRiverRaceManager(this);

	/**
	 * The token used for the API
	 */
	token: string = process.env.CLASH_ROYALE_TOKEN!;

	/**
	 * @param options - Options for the client
	 */
	constructor({ token }: ClientOptions = {}) {
		super();

		if (token != null) this.token = token;
		if (!this.token) throw new TypeError(Errors.tokenMissing());
	}
}

export default ClientRoyale;
