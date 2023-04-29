import { MODEL_TRAINING_PASSWORD } from '$env/static/private';
import { db } from '$lib/db/index.js';
import { error, fail } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.session.data.authenticated) {
		return {
			allowed: true,
			acronym: 'lumpy gorillas teach math'
		};
	}
	return {
		allowed: false
	};
}

export const actions = {
	train: async ({ request, locals }) => {
		if (!locals.session.data.authenticated) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const selection = formData.get('selection');
		if (!['yes', 'no', 'sort-of'].includes(selection as string) || typeof selection !== 'string') {
			return fail(400, { selection, invalidSelection: true });
		}

		const acronym = formData.get('acronym');
		if (!acronym || typeof acronym !== 'string') {
			return fail(400, {
				selection,
				invalidCustomMessage: 'Please provide a custom acronym.'
			});
		}

		const words = acronym.split(' ');
		if (words.length !== 4) {
			return fail(400, {
				selection,
				invalidCustomMessage: 'The acronym must be four words long.'
			});
		}
		const actualAcronym = words.map((word) => word[0].toUpperCase()).join('');
		if (actualAcronym !== 'LGTM') {
			return fail(400, {
				selection,
				invalidCustomMessage: `The acronym field must form the acronym LGTM. Received: ${actualAcronym}`
			});
		}

		try {
			await db
				.insertInto('learn_submissions')
				.values({
					submitter_name: locals.session.data.name ?? 'unknown',
					acronym: acronym.toLowerCase(),
					classification: selection === 'no' ? 'bad' : 'good'
				})
				.execute();
		} catch (e) {
			console.log(e);
			return fail(500);
		}

		return {
			success: true
		};
	},
	authenticate: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const password = formData.get('password');

		if (typeof name !== 'string' || !name) {
			return fail(400, { name, invalidName: true });
		}
		if (typeof password !== 'string' || !password) {
			return fail(400, { name, invalidPassword: true });
		}

		if (password === MODEL_TRAINING_PASSWORD) {
			await locals.session.update((session) => ({ ...session, authenticated: true, name }));
		} else {
			return fail(400, { name, invalidPassword: true });
		}

		return {
			success: true
		};
	}
};
