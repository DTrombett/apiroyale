import type { QueuePromise } from "./Constants";

/**
 * A queue to wait for an action to be completed before continuing
 */
export class Queue {
	/**
	 * The promises in the queue
	 */
	promises: QueuePromise[] = [];

	/**
	 * Waits for last promise to resolve and queues a new one.
	 */
	wait(): Promise<void> {
		let resolve!: () => void;
		const next = this.promises.at(-1)?.promise ?? Promise.resolve();
		const promise = new Promise<void>((res) => {
			resolve = res;
		});

		this.promises.push({ resolve, promise });
		return next;
	}

	/**
	 * Removes the last promise from the queue.
	 */
	next(): void {
		this.promises.shift()?.resolve();
	}
}

export default Queue;
