import { getAcronym } from '$lib/get-acronym';
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
	const orientation = url.searchParams.get('orientation');
	const id = url.searchParams.get('id');

	const { id: resolvedId, l, g, t, m } = await getAcronym(id ?? undefined);

	if (id !== resolvedId || !orientation) {
		const params = new URLSearchParams();
		params.set('orientation', orientation ?? 'along-y');
		params.set('id', resolvedId);
		throw redirect(307, `/?${params}`);
	}

	const acronymArray = [l, g, t, m];

	if (orientation === 'along-y') {
		return { lgtm: acronymArray.join('\n.\n') + '\n.' };
	}

	const longest = acronymArray.map((line) => line.length).reduce((a, b) => Math.max(a, b));
	const split = acronymArray.map((line) => line.split(''));
	const lines: Array<string> = [];
	for (let i = 0; i < longest; i++) {
		const letters: Array<string | undefined> = [];
		for (let j = 0; j < split.length; j++) {
			letters.push(split[j][i] ?? '&nbsp;');
		}
		lines.push(letters.join(i === 0 ? '.' : ' ') + (i === 0 ? '.' : ' '));
	}
	return { lgtm: lines.join('\n') };
}
