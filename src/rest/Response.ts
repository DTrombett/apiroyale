import type { IncomingHttpHeaders, IncomingMessage } from "node:http";
import type { APIRequest } from "..";

/**
 * Represents a response from the API
 */
export class Response {
	/**
	 * The raw data from the response
	 */
	data: string | null;

	/**
	 * The status code of the response
	 */
	statusCode: number;

	/**
	 * The headers of the response
	 */
	headers: IncomingHttpHeaders;

	/**
	 * The status of the response
	 */
	status: string;

	/**
	 * The request that generated this response
	 */
	request: APIRequest;

	/**
	 * @param data - The raw data from the response
	 * @param res - The response object
	 * @param request - The request that generated this response
	 */
	constructor(data: string, res: IncomingMessage, request: APIRequest) {
		this.data = data || null;
		this.statusCode = res.statusCode!;
		this.headers = res.headers;
		this.status = res.statusMessage!;
		this.request = request;
	}
}

export default Response;
