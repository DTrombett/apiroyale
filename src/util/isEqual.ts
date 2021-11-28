/**
 * Check whether two values are equal, checking all properties if it's an object.
 * @param x - First value to compare
 * @param y - Second value to compare
 * @returns Whether the two values are equal
 */
export const isEqual = <T>(x: T, y: T): boolean => {
	if (x === y) return true;
	if (typeof x !== typeof y) return false;
	if (typeof x !== "object") return false;
	if (x === null || y === null) return false;
	if (Object.keys(x).length !== Object.keys(y).length) return false;
	for (const key in x)
		if (!isEqual(x[key as keyof typeof x], y[key as keyof typeof x]))
			return false;
	return true;
};
