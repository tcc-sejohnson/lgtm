import { MODEL_TRAINING_PASSWORD } from '$env/static/private';
import { db } from '$lib/db/index.js';
import { generateAcronym } from '$lib/statistics/utils.js';
import { error, fail, redirect } from '@sveltejs/kit';
import classifierJson from '$lib/statistics/classifier.json?raw';
// @ts-expect-error -- module not typed
import bayes from 'bayes';
import type { InsertResult } from 'kysely';

const classifier = bayes.fromJson(classifierJson);

export async function load({ locals }) {
	if (locals.session.data.authenticated) {
		let acronym = generateAcronym();
		let good = false;
		while (!good) {
			const result = await classifier.categorize(acronym);
			if (result === 'good') {
				good = true;
			} else {
				acronym = generateAcronym();
			}
		}

		return {
			allowed: true,
			acronym
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

		const acronym = formData.get('acronym') as string;
		const acronymIsInvalid = validateAcronym(acronym);
		if (acronymIsInvalid) {
			return fail(400, { selection, invalidCustomMessage: acronymIsInvalid });
		}

		try {
			await db
				.insertInto('learn_submissions')
				.values({
					submitter_name: locals.session.data.name ?? 'unknown',
					acronym: acronym.toLowerCase(),
					classification: selection === 'no' ? 'bad' : 'good'
				})
				.onConflict((oc) =>
					oc.constraint('learn_submissions_pkey').doUpdateSet((eb) => ({
						submitter_name: eb.ref('excluded.submitter_name'),
						acronym: eb.ref('excluded.acronym'),
						classification: eb.ref('excluded.classification')
					}))
				)
				.execute();
		} catch (e) {
			return fail(500);
		}

		return {
			success: true
		};
	},
	upload: async ({ request, locals }) => {
		if (!locals.session.data.authenticated) {
			throw error(401, 'Unauthorized');
		}

		const formData = await request.formData();
		const file = formData.get('file');
		if (!file || !(file instanceof File)) {
			return fail(400, { invalidFile: true });
		}
		if (file.size > 1000000) {
			return fail(400, { fileTooLarge: true });
		}

		const text = await file.text();
		const lines = text.split('\n');
		const insertPromises: Promise<InsertResult[]>[] = [];
		for (let i = 0; i < lines.length / 1000; i++) {
			insertPromises.push(
				db
					.insertInto('learn_submissions')
					.values(
						lines
							.slice(i * 1000, (i + 1) * 1000)
							.filter((line) => {
								const lineIsInvalid = validateAcronym(line);
								return !lineIsInvalid; // TODO: Do some errory thing
							})
							.map((line) => ({
								submitter_name: locals.session.data.name ?? 'unknown',
								acronym: line.toLowerCase(),
								classification: 'good'
							}))
					)
					.onConflict((oc) =>
						oc.constraint('learn_submissions_pkey').doUpdateSet((eb) => ({
							submitter_name: eb.ref('excluded.submitter_name'),
							acronym: eb.ref('excluded.acronym'),
							classification: eb.ref('excluded.classification')
						}))
					)
					.execute()
			);
		}
		await Promise.all(insertPromises);
		throw redirect(303, '/train/success');
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

function validateAcronym(acronym: FormDataEntryValue | null): string | undefined {
	if (!acronym || typeof acronym !== 'string') {
		return 'Please provide a custom acronym.';
	}

	const words = acronym.split(' ');
	if (words.length !== 4) {
		return 'The acronym must be four words long.';
	}
	const actualAcronym = words.map((word) => word[0].toUpperCase()).join('');
	if (actualAcronym !== 'LGTM') {
		return `The acronym field must form the acronym LGTM. Received: ${actualAcronym}`;
	}
}
