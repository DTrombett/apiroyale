import type { OutgoingHttpHeaders } from "node:http";
import { get } from "node:https";
import { URL, URLSearchParams } from "node:url";
import type { Path, RequestOptions, Rest } from "..";
import Constants, { Errors, RequestStatus } from "../util";
import Response from "./Response";

/**
 * A class representing a request to the API
 */
export class APIRequest {
	/**
	 * The base url of this request
	 */
	baseUrl: string;

	/**
	 * Headers to be sent in the request
	 */
	headers: OutgoingHttpHeaders;

	/**
	 * The path of this request
	 */
	path: Path;

	/**
	 * Query applied to the request
	 */
	query: URLSearchParams;

	/**
	 * The rest manager that instantiated this
	 */
	rest: Rest;

	/**
	 * The status of this request
	 */
	status = RequestStatus.Pending;

	/**
	 * @param rest - The rest that instantiated this
	 * @param path - The path to request
	 * @param options - Options for this request
	 */
	constructor(
		rest: Rest,
		path: Path,
		{ url = Constants.baseAPIUrl, query, headers }: RequestOptions = {}
	) {
		this.path = path;
		this.rest = rest;

		this.baseUrl = url;
		this.query = new URLSearchParams(query);

		this.headers = {
			Accept: Constants.acceptHeader,
			Authorization: `${Constants.authorizationHeaderPrefix} ${rest.client.token}`,
			...headers,
		};
	}

	/**
	 * The full URL of this request
	 */
	get url(): URL {
		const url = new URL(this.baseUrl);

		url.pathname += this.path;
		url.search = this.query.toString();
		return url;
	}

	/**
	 * Edit headers for this request.
	 * @param headers - Headers to add/remove
	 * @returns The new request
	 */
	editHeaders(headers: RequestOptions["headers"]): this {
		this.headers = { ...this.headers, ...headers };
		return this;
	}

	/**
	 * Send the request to the api.
	 * @returns A promise that resolves with the response
	 */
	send(): Promise<Response> {
		this.rest.client.emit("requestStart", this);
		this.status = RequestStatus.InProgress;
		return new Promise<Response>((resolve, reject) => {
			this.make(resolve, reject);
		});
	}

	/**
	 * Make the request to the API.
	 * @param resolve - A function to resolve the promise
	 * @param reject - A function to reject the promise
	 */
	private make(
		resolve: (value: PromiseLike<Response> | Response) => void,
		reject: (reason?: any) => void
	) {
		// This is the data we'll receive
		let data = "";

		const timeout = setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			req.destroy(new Error(Errors.requestAborted(this.path)));
		}, Constants.defaultAbortTimeout).unref();
		const req = get(
			this.url,
			{
				headers: this.headers,
			},
			(res) => {
				if (
					[301, 302].includes(res.statusCode!) &&
					res.headers.location != null
				) {
					// Handle a possible redirect
					this.url.href = res.headers.location;
					this.url.search = this.query.toString();
					this.make(resolve, reject);
					return;
				}

				// Handle the data received
				res.on("data", (d: string) => {
					data += d;
					this.rest.client.emit("chunk", d);
				});
				res.once("end", () => {
					if (!res.complete) return;
					clearTimeout(timeout);
					const response = new Response(data, res, this);

					resolve(response);
					this.status = RequestStatus.Finished;
					this.rest.client.emit("requestEnd", response);
				});
			}
		);

		req.once("error", (error) => {
			reject(new Error(Errors.requestError(this.url, error)));
			this.status = RequestStatus.Failed;
		});
		req.end();
	}
}

export default APIRequest;
