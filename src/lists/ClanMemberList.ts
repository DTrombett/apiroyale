import type {
	APIClanMemberList,
	ClientRoyale,
	FetchClanMembersOptions,
	ListMethod,
} from "..";
import { ClanMember } from "../structures";
import List from "./List";

/**
 * Manage a clan member list
 */
export class ClanMemberList extends List<ClanMember["id"], ClanMember> {
	/**
	 * @param client - The client that instantiated this list
	 * @param options - The options used to get these results
	 * @param data - The results provided by the API
	 */
	constructor(
		client: ClientRoyale,
		options: FetchClanMembersOptions,
		data: APIClanMemberList
	) {
		super(
			client,
			client.fetchClanMembers.bind(client) as ListMethod<
				ClanMember["id"],
				ClanMember
			>,
			options,
			data.paging,
			data.items.map((value) => {
				const member = new ClanMember(client, value, options.tag);

				return [member.id, member];
			})
		);
	}
}

export default ClanMemberList;
