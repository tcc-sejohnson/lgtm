import fs from 'fs';

const letters = ['L', 'G', 'T', 'M'];

function dictionaryPath(letter) {
	return `./src/lib/dictionaries/${letter}.json`;
}

function indexedDictionaryPath(letter) {
	return `./src/lib/dictionaries/${letter}-by-part-of-speech.json`;
}

function indexDictionary(letter) {
	const dictionary = JSON.parse(fs.readFileSync(dictionaryPath(letter), 'utf8'));
	const indexedDictionary = {};
	for (const { word, partsOfSpeech } of dictionary) {
		for (const partOfSpeech of partsOfSpeech) {
			if (indexedDictionary[partOfSpeech]) {
				indexedDictionary[partOfSpeech].push(word);
			} else {
				indexedDictionary[partOfSpeech] = [word];
			}
		}
	}
	fs.writeFileSync(indexedDictionaryPath(letter), JSON.stringify(indexedDictionary, null, 2));
}

for (const letter of letters) {
	indexDictionary(letter);
}
