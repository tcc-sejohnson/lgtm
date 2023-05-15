import { db } from '$lib/db';
import type { InsertResult } from 'kysely';
import { generateAcronym, loadExistingClassifier } from './utils';

export async function generateAcronyms(): Promise<void> {
	const classifier = loadExistingClassifier();
	const acronyms: string[] = [];
	const classificationPromises = [];
	for (let i = 0; i < 100_000; i++) {
		const acronym = generateAcronym();
		classificationPromises.push(classifier.categorize(acronym));
		acronyms.push(acronym);
	}
	const classifications = await Promise.all(classificationPromises);
	const goodAcronyms = acronyms
		.filter((_, i) => classifications[i] === 'good')
		.map((acronym) => {
			const [l, g, t, m] = acronym.split(' ');
			return { l, g, t, m };
		});

	const insertPromises: Promise<InsertResult[]>[] = [];
	console.log(`Inserting ${goodAcronyms.length} acronyms`);
	for (let i = 0; i < goodAcronyms.length / 1000; i++) {
		insertPromises.push(
			db
				.insertInto('acronyms')
				.values(goodAcronyms.slice(i * 1000, (i + 1) * 1000))
				.onConflict((oc) => oc.constraint('unique_acronym').doNothing())
				.execute()
		);
	}
	await Promise.all(insertPromises);
}
