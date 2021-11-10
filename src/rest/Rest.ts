import { AsyncQueue } from "@sapphire/async-queue";
import type { ClientRoyale, Json, Path, RequestOptions } from "..";
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
	queue = new AsyncQueue();

	/**
	 * If we are ratelimited
	 */
	rateLimited = false;

	/**
	 * All requests that have been made so far
	 */
	requests: APIRequest[] = [];

	/**
	 * @param client - The client that instantiated this
	 */
	constructor(client: ClientRoyale) {
		this.client = client;
	}

	/**
	 * Make a request to the API.
	 * @param path - The path to request
	 * @param options - Other options for this request
	 * @template T The return type that should be used by the function
	 * @returns The JSON data received from the API or null if no data was received
	 */
	async get<T extends Json | null = Json | null>(
		path: Path,
		options?: RequestOptions & { retry?: boolean; force?: boolean }
	): Promise<T> {
		await this.queue.wait();

		if (this.rateLimited && options?.force !== true)
			throw new Error(
				"The rest is ratelimited so no other requests are allowed until you set the force option to true"
			);

		const request = new APIRequest(this, path, options);

		this.requests.push(request);

		const res = await request.send();
		let data: T | null | undefined;

		if (res.statusCode === 429) {
			// If we encountered a ratelimit... well, this is a problem!
			this.rateLimited = true;
			this.queue.shift();
			throw new ErrorRoyale(request, res);
		}
		if (res.statusCode >= 200 && res.statusCode < 300)
			// If the request is ok parse the data received
			data = JSON.parse(res.data!) as T;
		else if (res.statusCode >= 300 && res.statusCode < 400)
			// In this case we have no data
			data = null;
		else if (res.statusCode >= 500 && options?.retry === true) {
			// If there's a server error retry just one time
			this.queue.shift();
			return this.get(path, { ...options, retry: false });
		}

		this.queue.shift();
		if (data !== undefined) return data!;

		// If we didn't receive a succesful response, throw an error
		throw new ErrorRoyale(request, res);
	}
}

export default Rest;
