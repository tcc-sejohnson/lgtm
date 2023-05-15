import { dev } from '$app/environment';
import { trainOnNew } from '$lib/statistics/train-classifier.js';
import { error } from '@sveltejs/kit';

export function load() {
	if (!dev) {
		throw error(400, 'This page is only available in development mode.');
	}
}

export const actions = {
	default: async () => {
		await trainOnNew();
	}
};
