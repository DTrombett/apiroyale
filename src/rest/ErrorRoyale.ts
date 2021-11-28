import type { OutgoingHttpHeaders } from "node:http";
import type { APIRequest, APIError, Path, Response } from "..";

/**
 * A class representing an error received from the API
 */
export class ErrorRoyale extends Error {
	/**
	 * Headers sent in the request
	 */
	headers: OutgoingHttpHeaders;

	/**
	 * Path of the request
	 */
	path: Path;

	/**
	 * The query of the request
	 */
	query?: string;

	/**
	 * The status message received from the API
	 */
	status: string;

	/**
	 * The status code received for this request
	 */
	statusCode: number;

	/**
	 * @param request - The request sent
	 * @param res - The response received
	 */
	constructor(request: APIRequest, res: Response) {
		let error: string | undefined;
		const query = request.query.toString();

		if (res.data != null) error = (JSON.parse(res.data) as APIError).message;
		if (error == null) error = res.status;
		super(error);

		if (query) this.query = query;

		this.headers = request.headers;
		this.path = request.path;
		this.status = res.status;
		this.statusCode = res.statusCode;
	}
}

export default ErrorRoyale;
