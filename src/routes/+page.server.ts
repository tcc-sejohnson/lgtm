import { getExpandedLGTM } from '$lib/get-expanded-acronym';

export function load() {
	return { lgtm: getExpandedLGTM() };
}
