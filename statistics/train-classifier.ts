import fs from 'fs';
import bayes from 'bayes';
import { sql } from '@vercel/postgres';

function loadExistingClassifier(): {
	learn: (text: string, group: 'good' | 'bad') => Promise<unknown>;
	toJson: () => string;
} {
	if (!fs.existsSync('./src/lib/statistics/classifier.json')) {
		return bayes();
	}
	return bayes.fromJson(fs.readFileSync('./src/lib/statistics/classifier.json', 'utf8'));
}

function writeClassifier(classifierJson: string): void {
	fs.writeFileSync('./src/lib/statistics/classifier.json', classifierJson);
}

async function trainOnNew(): Promise<void> {
	const result = await sql<{
		acronym: string;
		classification: 'good' | 'bad';
	}>`SELECT acronym, classification FROM learn_submissions WHERE NOT processed`;
	const classifier = loadExistingClassifier();
	const promises: Promise<unknown>[] = [];
	for (const acronym of result.rows
		.filter((row) => row.classification === 'good')
		.map((row) => row.acronym)) {
		promises.push(classifier.learn(acronym, 'good'));
	}
	for (const acronym of result.rows
		.filter((row) => row.classification === 'bad')
		.map((row) => row.acronym)) {
		promises.push(classifier.learn(acronym, 'bad'));
	}
	await Promise.all(promises);
	await sql`UPDATE learn_submissions SET processed = true WHERE NOT processed`;
	writeClassifier(classifier.toJson());
}

await trainOnNew();
