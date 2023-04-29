import fs from 'fs';
import bayes from 'bayes';
import { sql } from '@vercel/postgres';

function loadExistingClassifier(): {
	learn: (text: string, group: 'good' | 'bad') => Promise<void>;
	toJson: () => string;
} {
	if (!fs.existsSync('./statistics/classifier.json')) {
		// @ts-expect-error - this module is barely typed but it's typed enough to be annoying
		return bayes();
	}
	return bayes.fromJson(fs.readFileSync('./statistics/classifier.json', 'utf8'));
}

function writeClassifier(classifierJson: string): void {
	fs.writeFileSync('./statistics/classifier.json', classifierJson);
}

async function trainOnNew(): Promise<void> {
	const result = await sql<{
		acronym: string;
		classification: 'good' | 'bad';
	}>`SELECT acronym, classification FROM learn_submissions WHERE NOT processed`;
	const classifier = loadExistingClassifier();
	for (const acronym of result.rows
		.filter((row) => row.classification === 'good')
		.map((row) => row.acronym)) {
		await classifier.learn(acronym, 'good');
	}
	for (const acronym of result.rows
		.filter((row) => row.classification === 'bad')
		.map((row) => row.acronym)) {
		await classifier.learn(acronym, 'bad');
	}
	await sql`UPDATE learn_submissions SET processed = true WHERE NOT processed`;
	writeClassifier(classifier.toJson());
}

await trainOnNew();
