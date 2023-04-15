import fs from 'fs';

const letters = ['L', 'G', 'T', 'M'];

function dictionaryPath(letter) {
	return `./src/lib/dictionaries/${letter}.json`;
}

function indexByPartOfSpeech(raw) {
	const indexedDictionary = {};
	for (const { word, partsOfSpeech } of raw) {
		for (const partOfSpeech of partsOfSpeech) {
			if (indexedDictionary[partOfSpeech]) {
				indexedDictionary[partOfSpeech].push(word);
			} else {
				indexedDictionary[partOfSpeech] = [word];
			}
		}
	}
	return indexedDictionary;
}

const dictionaryByLetter = {};
for (const letter of letters) {
	const raw = JSON.parse(fs.readFileSync(dictionaryPath(letter), 'utf8'));
	dictionaryByLetter[letter] = {
		list: raw,
		byPartOfSpeech: indexByPartOfSpeech(raw)
	};
}
fs.writeFileSync(
	'./src/lib/dictionaries/indexed.json',
	JSON.stringify(dictionaryByLetter, null, 2)
);
