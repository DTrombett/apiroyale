import type ClientRoyale from "..";
import type { Path, RequestOptions, ResponseType, RestResponse } from "..";
import { Errors, Queue } from "../util";
import APIRequest from "./APIRequest";
import ErrorRoyale from "./ErrorRoyale";

/**
 * A rest manager for the client
 */
export class Rest {
	/**
	 * The client that instantiated this
	 */
	client: ClientRoyale;

	/**
	 * A queue for the requests
	 */
	queue = new Queue();

	/**
	 * Whether or not the client is currently rate limited
	 */
	rateLimited = false;

	/**
	 * @param client - The client that instantiated this
	 */
	// TODO: remove client
	constructor(client: ClientRoyale) {
		this.client = client;
	}

	/**
	 * Make a request to the API.
	 * @param path - The path to the API endpoint
	 * @param options - Other options for this request
	 * @returns The raw JSON data received from the API or null if no data was received
	 */
	async get<T extends Path>(
		path: T,
		options?: RequestOptions & { retry?: boolean; force?: boolean }
	): Promise<RestResponse<T>> {
		await this.queue.wait();

		if (this.rateLimited && options?.force !== true)
			throw new Error(Errors.restRateLimited());
		const req = new APIRequest(this, path, options);
		const res = await req.send();
		let data: ResponseType<T> | null | undefined;

		if (res.statusCode === 429) {
			// If we encountered a ratelimit... well, this is a problem!
			this.rateLimited = true;
			this.queue.next();
			throw new ErrorRoyale(req, res);
		}
		if (res.statusCode >= 200 && res.statusCode < 300)
			// If the request is ok parse the data received
			data =
				res.data != null ? (JSON.parse(res.data) as ResponseType<T>) : null;
		else if (res.statusCode >= 300 && res.statusCode < 400)
			// In this case we have no data
			data = null;
		else if (res.statusCode >= 500 && options?.retry === true) {
			// If there's a server error retry just one time
			this.queue.next();
			return this.get(path, { ...options, retry: false });
		}
		const maxAge = res.headers["cache-control"]?.match(/max-age=(\d+)/)?.[1];

		this.queue.next();
		if (data !== undefined)
			return {
				data: data!,
				maxAge: Date.now() + (maxAge !== undefined ? parseInt(maxAge, 10) : 0),
			};
		// If we didn't receive a successful response, throw an error
		throw new ErrorRoyale(req, res);
	}
}

export default Rest;
