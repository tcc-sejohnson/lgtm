import fs from 'fs';

function filename(letter: string, partOfSpeech: string): string {
	return `/Users/elliottjohnson/dev/me/lgtm/src/lib/${letter}-${partOfSpeech}.txt`;
}

function populateMap(map: Map<string, Set<string>>, array: string[], partOfSpeech: string) {
	array.forEach((word) => {
		if (map.has(word)) {
			map.get(word).add(partOfSpeech);
		} else {
			map.set(word, new Set([partOfSpeech]));
		}
	});
}

export function load() {
	// const letter = 'M';
	// const adjectives = fs.readFileSync(filename(letter, 'adjectives'), 'utf8');
	// const adverbs = fs.readFileSync(filename(letter, 'adverbs'), 'utf8');
	// const nouns = fs.readFileSync(filename(letter, 'nouns'), 'utf8');
	// const verbs = fs.readFileSync(filename(letter, 'verbs'), 'utf8');
	// const map = new Map<string, Set<string>>();
	// populateMap(map, adjectives.split('\n'), 'adjective');
	// populateMap(map, adverbs.split('\n'), 'adverb');
	// populateMap(map, nouns.split('\n'), 'noun');
	// populateMap(map, verbs.split('\n'), 'verb');
	// const dictionary = [];
	// map.forEach((value, key) => {
	// 	dictionary.push({
	// 		word: key,
	// 		partsOfSpeech: Array.from(value)
	// 	});
	// });
	// fs.writeFileSync(
	// 	`/Users/elliottjohnson/dev/me/lgtm/src/lib/dictionaries/${letter}.json`,
	// 	JSON.stringify(dictionary, null, 2)
	// );
}
