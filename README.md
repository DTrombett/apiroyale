# apiroyale

**apiroyale** is a [Node.js](https://nodejs.org/) library to interact with the [Clash Royale API](https://developer.clashroyale.com/#/).

## Installation

You can install this package using a package manager like [npm](https://www.npmjs.com/):

```sh
npm install apiroyale
```

**Note:** Node.js 16.9.0 or higher is required.

## Description

This library helps you to interact with the Clash Royale API.

All fetched structures are cached for a short time to prevent unnecessary API calls.
You can use `cache` and `cacheNested` options to disable caching and save memory.

## Usage

To start interacting with the API, create a new client:

```ts
import ClientRoyale from "apiroyale";

const client = new ClientRoyale({ token: "<your-token>" });

// Request a clan by tag
client.clans.fetch("<clan-tag>").then((clan) => {
	console.log(clan.name);
});
// You can disable caching by passing `cache: false`
client.clans.fetch("<clan-tag>", { cache: false }).then((clan) => {
	console.log(clan.name);
});
// Note that you can also pass default cache/cacheNested options to the client constructor
const client = new ClientRoyale({
	token: "<your-token>",
	cache: false,
	cacheNested: false,
});
```

```ts
// Search for a clan by name
client.clans
	.search({ name: "clan name", limit: 10 })
	.then((clans) => {
		console.log(clans.items[0].name);
		// You can also use pagination
		return client.clans.search({
			name: "clan name",
			limit: 10,
			after: clans.paging.cursors.after,
		});
	})
	.then((clans) => {
		console.log(clans.items[0].name);
	});
```

You can also do a raw request without using the client:

```ts
import { Rest } from "apiroyale";

const rest = new Rest();

rest.get("/clans/<clan-tag>").then((response) => {
	console.log(response); // { maxAge: 1650906957599, data: { ... } }
});
```

---

**This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell’s Fan Content Policy](http://www.supercell.com/fan-content-policy).**
