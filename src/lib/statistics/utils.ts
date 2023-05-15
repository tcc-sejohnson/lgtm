import L from '$lib/statistics/dictionaries/l';
import G from '$lib/statistics/dictionaries/g';
import T from '$lib/statistics/dictionaries/t';
import M from '$lib/statistics/dictionaries/m';
// @ts-expect-error - no types
import bayes from 'bayes';
import fs from 'fs';

export function getRandomElement<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function generateAcronym(): string {
	return `${getRandomElement(L)} ${getRandomElement(G)} ${getRandomElement(T)} ${getRandomElement(
		M
	)}`;
}

export function loadExistingClassifier(): {
	learn: (text: string, group: 'good' | 'bad') => Promise<unknown>;
	toJson: () => string;
	categorize: (text: string) => Promise<'good' | 'bad'>;
} {
	if (!fs.existsSync('./src/lib/statistics/classifier.json')) {
		throw new Error('Classifier file does not exist');
	}
	return bayes.fromJson(fs.readFileSync('./src/lib/statistics/classifier.json', 'utf8'));
}
