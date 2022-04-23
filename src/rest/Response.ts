import type { IncomingHttpHeaders, IncomingMessage } from "node:http";

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
	 * @param data - The raw data from the response
	 * @param res - The response object
	 */
	constructor(data: string, res: IncomingMessage) {
		this.data = data || null;
		this.statusCode = res.statusCode!;
		this.headers = res.headers;
		this.status = res.statusMessage!;
	}
}

export default Response;
