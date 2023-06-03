// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck This is for type incompatibility between custom and base collections
import type { Comparator } from "@discordjs/collection";
import { Collection as BaseCollection } from "@discordjs/collection";

/**
 * A custom collection
 */
export class Collection<K, V> extends BaseCollection<K, V> {
	/**
	 * Creates an array with the values of this collection.
	 */
	array(): V[] {
		return [...this.values()];
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 * @returns The cloned collection
	 */
	clone(): Collection<K, V> {
		return new Collection(this);
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 * @param collections - Collections to merge
	 */
	concat<K2, V2>(
		...collections: Collection<K2, V2>[]
	): Collection<K | K2, V | V2>;
	concat(...collections: Collection<K, V>[]): Collection<K, V> {
		const newColl = this.clone();

		for (const coll of collections)
			for (const [key, val] of coll) newColl.set(key, val);
		return newColl;
	}

	/**
	 * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
	 * @param other - The other Collection to filter against
	 */
	difference<T>(other: Collection<K, T>): Collection<K, T | V> {
		const coll = new Collection<K, T | V>();

		for (const [k, v] of other) if (!this.has(k)) coll.set(k, v);
		for (const [k, v] of this) if (!other.has(k)) coll.set(k, v);
		return coll;
	}

	/**
	 * Check if this collection has all the items of another collection.
	 * @param collection - The collection to check against
	 * @returns Whether or not this collection has all the items of another collection
	 */
	equals(collection: Collection<K, V>): collection is this {
		if (this === collection) return true;
		if (this.size !== collection.size) return false;
		for (const [key] of this) if (!collection.has(key)) return false;
		return true;
	}

	/**
	 * Identical to
	 * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * but returns a Collection instead of an Array.
	 * @param fn - The function to test with
	 * @param thisArg - Value to use as `this` when executing function
	 */
	filter<K2 extends K>(
		fn: (value: V, key: K, collection: this) => key is K2
	): Collection<K2, V>;
	filter<V2 extends V>(
		fn: (value: V, key: K, collection: this) => value is V2
	): Collection<K, V2>;
	filter(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V>;
	filter<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This
	): Collection<K2, V>;
	filter<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This
	): Collection<K, V2>;
	filter<This>(
		fn: (this: This, value: V, key: K, collection: this) => boolean,
		thisArg: This
	): Collection<K, V>;
	filter(
		fn: (value: V, key: K, collection: this) => boolean,
		thisArg?: unknown
	): Collection<K, V> {
		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
		const result = new Collection<K, V>();

		for (const [key, value] of this)
			if (fn(value, key, this)) result.set(key, value);
		return result;
	}

	/**
	 * Maps each item into a Collection, then joins the results into a single Collection. Identical in behavior to
	 * [Array.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).
	 * @param fn - Function that produces a new Collection
	 * @param thisArg - Value to use as `this` when executing function
	 */
	flatMap<T>(
		fn: (value: V, key: K, collection: this) => Collection<K, T>
	): Collection<K, T>;
	flatMap<T, This>(
		fn: (this: This, value: V, key: K, collection: this) => Collection<K, T>,
		thisArg: This
	): Collection<K, T>;
	flatMap<T>(
		fn: (value: V, key: K, collection: this) => Collection<K, T>,
		thisArg?: unknown
	): Collection<K, T> {
		return new Collection<K, T>().concat(...this.map(fn, thisArg));
	}

	/**
	 * Returns the index of the first occurrence of a value in the collection, or -1 if it is not present.
	 * @param searchElement - The value to locate in the collection
	 * @returns The index of the first occurrence of a value in the collection, or -1 if it is not present
	 */
	indexOf(searchElement: V): number {
		return [...this.values()].indexOf(searchElement);
	}

	/**
	 * The intersect method returns a new structure containing items where the keys and values are present in both original structures.
	 * @param other - The other Collection to filter against
	 */
	intersect<T>(other: Collection<K, T>): Collection<K, T> {
		const coll = new Collection<K, T>();

		for (const [k, v] of other) if (this.has(k)) coll.set(k, v);
		return coll;
	}

	/**
	 * Maps each item to another value into a collection. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param fn - Function that produces an element of the new collection, taking three arguments
	 * @param thisArg - Value to use as `this` when executing function
	 */
	mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T>;
	mapValues<This, T>(
		fn: (this: This, value: V, key: K, collection: this) => T,
		thisArg: This
	): Collection<K, T>;
	mapValues<T>(
		fn: (value: V, key: K, collection: this) => T,
		thisArg?: unknown
	): Collection<K, T> {
		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
		const coll = new Collection<K, T>();

		for (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 * @param fn - Function used to test
	 * @param thisArg - Value to use as `this` when executing function
	 */
	partition<K2 extends K>(
		fn: (value: V, key: K, collection: this) => key is K2
	): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
	partition<V2 extends V>(
		fn: (value: V, key: K, collection: this) => value is V2
	): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
	partition(
		fn: (value: V, key: K, collection: this) => boolean
	): [Collection<K, V>, Collection<K, V>];
	partition<This, K2 extends K>(
		fn: (this: This, value: V, key: K, collection: this) => key is K2,
		thisArg: This
	): [Collection<K2, V>, Collection<Exclude<K, K2>, V>];
	partition<This, V2 extends V>(
		fn: (this: This, value: V, key: K, collection: this) => value is V2,
		thisArg: This
	): [Collection<K, V2>, Collection<K, Exclude<V, V2>>];
	partition<This>(
		fn: (this: This, value: V, key: K, collection: this) => boolean,
		thisArg: This
	): [Collection<K, V>, Collection<K, V>];
	partition(
		fn: (value: V, key: K, collection: this) => boolean,
		thisArg?: unknown
	): [Collection<K, V>, Collection<K, V>] {
		if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
		const results: [Collection<K, V>, Collection<K, V>] = [
			new Collection<K, V>(),
			new Collection<K, V>(),
		];

		for (const [key, val] of this)
			results[Number(!fn(val, key, this))].set(key, val);
		return results;
	}

	/**
	 * Returns a copy of a section of a collection.
	 * Identical in behavior to [Array.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).
	 * @param start - The beginning index of the specified portion of the array
	 * @param end - The end index of the specified portion of the array
	 */
	slice(start?: number, end?: number): Collection<K, V> {
		return new Collection<K, V>([...this.entries()].slice(start, end));
	}

	/**
	 * The sorted method sorts the items of a collection and returns it.
	 * The default sort order is according to string Unicode code points.
	 * @param compareFunction - Specifies a function that defines the sort order
	 */
	sorted(compareFunction?: Comparator<K, V>): Collection<K, V> {
		return new Collection<K, V>(this).sort(
			compareFunction && ((av, bv, ak, bk) => compareFunction(av, bv, ak, bk))
		);
	}

	toJSON(): any {
		return super.toJSON();
	}

	/**
	 * * This method is not supported.
	 * @throws This method is not supported.
	 */
	protected merge(): never {
		throw new Error("This method is not supported.");
	}
}

export default Collection;
