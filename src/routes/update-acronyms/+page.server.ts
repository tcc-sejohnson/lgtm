import { dev } from '$app/environment';
import { generateAcronyms } from '$lib/statistics/generate-acronyms.js';
import { error } from '@sveltejs/kit';

export function load() {
	if (!dev) {
		throw error(400, 'This page is only available in development mode.');
	}
}

export const actions = {
	default: async () => {
		await generateAcronyms();
	}
};
