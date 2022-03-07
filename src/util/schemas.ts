import type { ValidateFunction } from "ajv";
import Ajv from "ajv";
import ajvKeywords from "ajv-keywords";
import instanceofDef from "ajv-keywords/dist/definitions/instanceof";
import type {
	APIPaging,
	ClientOptions,
	ConstructableStructure,
	FetchClanMembersOptions,
	FetchPlayerUpcomingChestsOptions,
	FetchRiverRaceLogOptions,
	ListOptions,
	ManagerOptions,
} from "..";

const tagRegex = /^#(0|2|8|9|P|Y|L|Q|G|R|J|C|U|V)+$/.toString();
export const schemas = {
	ClientOptions: {
		type: "object",
		properties: {
			abortTimeout: { type: "number", minimum: 0 },
			baseURL: { type: "string" },
			structureMaxAge: { type: "number", minimum: 0 },
			token: { type: "string" },
		},
	},
	ListOptions: {
		type: "object",
		properties: {
			after: { type: "string" },
			before: { type: "string" },
			limit: { type: "number", minimum: 1 },
		},
		additionalProperties: true,
	},
	FetchRiverRaceLogOptions: {
		type: "object",
		properties: {
			// ListOptions
			after: { type: "string" },
			before: { type: "string" },
			limit: { type: "number", minimum: 1 },
			// New options
			tag: { type: "string", regexp: tagRegex },
		},
	},
	FetchPlayerUpcomingChestsOptions: {
		type: "object",
		properties: {
			force: { type: "boolean" },
			tag: { type: "string", regexp: tagRegex },
		},
		required: ["tag"],
	},
	FetchClanMembersOptions: {
		type: "object",
		properties: {
			// ListOptions
			after: { type: "string" },
			before: { type: "string" },
			limit: { type: "number", minimum: 1 },
			// New options
			tag: { type: "string", regexp: tagRegex },
		},
		required: ["tag"],
	},
	ManagerOptions: {
		type: "object",
		properties: {
			addEvent: { type: "string" },
			data: { type: "array" },
			removeEvent: { type: "string" },
			sortMethod: { typeof: "function" },
			updateEvent: { type: "string" },
		},
		required: ["addEvent", "removeEvent", "updateEvent"],
	},
	APIPaging: {
		type: "object",
		properties: {
			cursors: {
				type: "object",
				properties: {
					after: { type: "string" },
					before: { type: "string" },
				},
			},
		},
		required: ["cursors"],
	},
};
const classes: (new (...args: any[]) => any)[] = [];

for (const c of classes) instanceofDef.CONSTRUCTORS[c.name] = c;
export const ajv = new Ajv({
	strict: true,
	strictTypes: true,
	strictTuples: true,
	strictRequired: true,
	allErrors: true,
	removeAdditional: true,
});
ajvKeywords(ajv);

export const compilePartialSchema = <T>(
	schema: typeof schemas[keyof typeof schemas]
): ValidateFunction<Partial<T>> =>
	ajv.compile<Partial<T>>({ ...schema, required: undefined });

export const validateClientOptions = ajv.compile<ClientOptions>(
	schemas.ClientOptions
);
export const validateListOptions = ajv.compile<ListOptions>(
	schemas.ListOptions
);
export const validateFetchRiverRaceLogOptions =
	ajv.compile<FetchRiverRaceLogOptions>(schemas.FetchRiverRaceLogOptions);
export const validateFetchPlayerUpcomingChestsOptions =
	ajv.compile<FetchPlayerUpcomingChestsOptions>(
		schemas.FetchPlayerUpcomingChestsOptions
	);
export const validateFetchClanMembersOptions =
	ajv.compile<FetchClanMembersOptions>(schemas.FetchClanMembersOptions);
export const validateManagerOptions = ajv.compile<
	ManagerOptions<ConstructableStructure>
>(schemas.ManagerOptions);
export const validateAPIPaging = ajv.compile<APIPaging>(schemas.APIPaging);
