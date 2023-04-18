import { getExpandedLGTM } from '$lib/get-expanded-acronym';
import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	const orientation = url.searchParams.get('orientation');
	const seedString = url.searchParams.get('seed');
	const parsedSeed = parseInt(seedString ?? '0');

	const { lgtm, seed } = getExpandedLGTM(parsedSeed);

	if (seedString !== seed.toString() || !orientation) {
		const params = new URLSearchParams();
		params.set('orientation', orientation ?? 'along-x');
		params.set('seed', seed.toString());
		throw redirect(307, `/?${params}`);
	}

	if (orientation === 'along-x') {
		const longest = lgtm.map((line) => line.length).reduce((a, b) => Math.max(a, b));
		const split = lgtm.map((line) => line.split(''));
		const lines: Array<string> = [];
		for (let i = 0; i < longest; i++) {
			const letters: Array<string | undefined> = [];
			for (let j = 0; j < split.length; j++) {
				letters.push(split[j][i] ?? '&nbsp;');
			}
			lines.push(letters.join(i === 0 ? '.' : ' '));
		}
		return { lgtm: lines.join('\n') };
	}

	return { lgtm: lgtm.join('\n.\n') };
}
