import fs from 'fs';
import { intro, outro, select, isCancel, spinner, text } from '@clack/prompts';
import bayes from 'bayes';

function listify(text: string): string[] {
	return text.split('\n').filter((line) => line.length > 0);
}

function getRandomElement<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

const L = listify(fs.readFileSync('./statistics/dictionary/l.txt', 'utf8'));
const G = listify(fs.readFileSync('./statistics/dictionary/g.txt', 'utf8'));
const T = listify(fs.readFileSync('./statistics/dictionary/t.txt', 'utf8'));
const M = listify(fs.readFileSync('./statistics/dictionary/m.txt', 'utf8'));

function* acronyms(): Generator<string> {
	while (true) {
		yield `${getRandomElement(L)} ${getRandomElement(G)} ${getRandomElement(T)} ${getRandomElement(
			M
		)}`;
	}
}

function appendBad(bad: string[]): void {
	const oldBad = listify(fs.readFileSync('./statistics/results/bad.json', 'utf8'));
	fs.writeFileSync('./statistics/results/bad.json', JSON.stringify(oldBad.concat(bad)));
}

function appendGood(good: string[]): void {
	const oldGood = listify(fs.readFileSync('./statistics/results/good.json', 'utf8'));
	fs.writeFileSync('./statistics/results/good.json', JSON.stringify(oldGood.concat(good)));
}

function loadExistingClassifier(): {
	learn: (text: string, group: 'good' | 'bad') => Promise<void>;
	toJson: () => string;
} {
	if (!fs.existsSync('./statistics/results/classifier.json')) {
		return bayes();
	}
	return bayes.fromJson(fs.readFileSync('./statistics/results/classifier.json', 'utf8'));
}

function writeClassifier(classifierJson: string): void {
	fs.writeFileSync('./statistics/results/classifier.json', classifierJson);
}

async function learn(): Promise<void> {
	let goodAcronyms: string[] = [];
	let badAcronyms: string[] = [];

	intro('Beginning classifier training session...');
	const s = spinner();
	s.start('Loading classifier...');
	const classifier = loadExistingClassifier();
	s.stop('Classifier loaded.');

	for (const acronym of acronyms()) {
		const result = await select<{ value: boolean | 'adjust'; label: string }[], boolean | 'adjust'>(
			{
				message: `Is "${acronym}" a good acronym?`,
				options: [
					{ value: true, label: 'Yes' },
					{ value: false, label: 'No' },
					{ value: 'adjust', label: 'Not quite, let me fix it' }
				]
			}
		);

		if (isCancel(result)) {
			break;
		}

		if (result === true) {
			await classifier.learn(acronym, 'good');
			goodAcronyms.push(acronym);
		} else if (result === 'adjust') {
			const modified = await text({
				message: `What should the acronym be? (Original was ${acronym})`,
				placeholder: acronym,
				validate: (text) => {
					const split = text.split(' ');
					if (text.split(' ').length !== 4) {
						return 'Acronym must be 4 words';
					}
					['l', 'g', 't', 'm'].forEach((letter, index) => {
						if (!split[index].startsWith(letter)) {
							return `Word ${index + 1} must start with ${letter}`;
						}
					});
				}
			});

			if (isCancel(modified)) {
				break;
			}

			await classifier.learn(modified, 'good');
		} else {
			await classifier.learn(acronym, 'bad');
			badAcronyms.push(acronym);
		}

		if (goodAcronyms.length >= 100) {
			appendGood(goodAcronyms);
			goodAcronyms = [];
		}
		if (badAcronyms.length >= 100) {
			appendBad(badAcronyms);
			badAcronyms = [];
		}
	}

	appendGood(goodAcronyms);
	appendBad(badAcronyms);
	writeClassifier(classifier.toJson());

	outro('Training session complete.');
}

async function retrainOnArchive(): Promise<void> {
	const classifier = bayes();
	const good = JSON.parse(fs.readFileSync('./statistics/results/good.json', 'utf8'));
	const bad = JSON.parse(fs.readFileSync('./statistics/results/bad.json', 'utf8'));
	console.log(good);
	for (const acronym of good) {
		await classifier.learn(acronym, 'good');
	}
	for (const acronym of bad) {
		await classifier.learn(acronym, 'bad');
	}
	writeClassifier(classifier.toJson());
}

await learn();
// await retrainOnArchive();
