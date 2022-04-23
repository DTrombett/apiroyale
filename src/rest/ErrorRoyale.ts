import type { OutgoingHttpHeaders } from "node:http";
import type { APIClientError, APIRequest, Path, Response } from "..";

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
	 * @param req - The request sent
	 * @param res - The response received
	 */
	constructor(req: APIRequest, res: Response) {
		const query = req.query.toString();
		let error: string | undefined;

		if (res.data != null)
			error = (JSON.parse(res.data) as APIClientError).message;
		if (error == null) error = res.status;
		super(error);

		if (query) this.query = query;
		this.headers = req.headers;
		this.path = req.path;
		this.status = res.status;
		this.statusCode = res.statusCode;
	}
}

export default ErrorRoyale;
