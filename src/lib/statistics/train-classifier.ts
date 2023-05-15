import fs from 'fs';

import { db } from '$lib/db';
import { loadExistingClassifier } from './utils';

function writeClassifier(classifierJson: string): void {
	fs.writeFileSync('./src/lib/statistics/classifier.json', classifierJson);
}

export async function trainOnNew(): Promise<void> {
	const result = await db
		.selectFrom('learn_submissions')
		.select(['id', 'acronym', 'classification'])
		.where('processed', '=', false)
		.execute();
	const classifier = loadExistingClassifier();
	const promises: Promise<unknown>[] = [];
	console.log(`Training on ${result.length} new submissions`);
	for (const acronym of result
		.filter((row) => row.classification === 'good')
		.map((row) => row.acronym)) {
		promises.push(classifier.learn(acronym, 'good'));
	}
	for (const acronym of result
		.filter((row) => row.classification === 'bad')
		.map((row) => row.acronym)) {
		promises.push(classifier.learn(acronym, 'bad'));
	}
	await Promise.all(promises);
	await db
		.updateTable('learn_submissions')
		.set({ processed: true })
		.where(
			'id',
			'in',
			result.map((row) => row.id)
		)
		.execute();
	writeClassifier(classifier.toJson());
}
