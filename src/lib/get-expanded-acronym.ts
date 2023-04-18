import dictionary from '$lib/dictionaries/indexed.json';
import { mulberry32 } from './utils';

const letters = ['L', 'G', 'T', 'M'] as const;

export interface ExpandedLGTMResponse {
	lgtm: [string, string, string, string];
	seed: number;
}

export function getExpandedLGTM(seed?: number): ExpandedLGTMResponse {
	const internalSeed =
		!seed || isNaN(seed) || !Number.isInteger(seed) ? Math.floor(Math.random() * 100_000) : seed;

	let previous: ResolvedWord | undefined;
	const lgtm = letters.map((letter) => {
		const resolvedWord = getWordBasedOnPreviousWord(letter, internalSeed, previous);
		previous = resolvedWord;
		return resolvedWord.word;
	}) as [string, string, string, string];
	return {
		lgtm,
		seed: internalSeed
	};
}

type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

interface ResolvedWord {
	word: string;
	partOfSpeech: PartOfSpeech;
}

function getWordBasedOnPreviousWord(
	letter: 'L' | 'G' | 'T' | 'M',
	seed: number,
	previous?: ResolvedWord
): ResolvedWord {
	if (!previous) {
		return getWord(letter, seed);
	}
	if (previous.partOfSpeech === 'adjective') {
		return getWordByPartOfSpeech(letter, 'noun', seed);
	}
	if (previous.partOfSpeech === 'adverb') {
		return getWordByPartOfSpeech(letter, 'verb', seed);
	}
	if (previous.partOfSpeech === 'verb') {
		return getWordByPartOfSpeech(letter, 'adjective', seed);
	}
	if (previous.partOfSpeech === 'noun') {
		return getWordByPartOfSpeech(letter, 'adverb', seed);
	}
	return getWord(letter, seed);
}

function getWord(letter: 'L' | 'G' | 'T' | 'M', seed: number): ResolvedWord {
	const availableWords = dictionary[letter];
	const { word, partsOfSpeech } = randomIndex(availableWords.list, seed);
	return {
		word,
		partOfSpeech: randomIndex(partsOfSpeech, seed) as PartOfSpeech
	};
}

function getWordByPartOfSpeech(
	letter: 'L' | 'G' | 'T' | 'M',
	partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb',
	seed: number
): ResolvedWord {
	const availableWords = dictionary[letter].byPartOfSpeech[partOfSpeech];
	return {
		word: randomIndex(availableWords, seed),
		partOfSpeech
	};
}

function randomIndex<T>(array: Array<T>, seed: number): T {
	const internalSeed = seed ?? Math.random() * 100_000;
	return array[Math.floor(mulberry32(internalSeed)() * array.length)];
}
