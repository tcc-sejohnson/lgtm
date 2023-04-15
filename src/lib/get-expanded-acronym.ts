import dictionary from '$lib/dictionaries/indexed.json';

const letters = ['L', 'G', 'T', 'M'] as const;

export function getExpandedLGTM(): [string, string, string, string] {
	let previous: ResolvedWord | undefined;
	return letters.map((letter) => {
		const resolvedWord = getWordBasedOnPreviousWord(letter, previous);
		previous = resolvedWord;
		return resolvedWord.word;
	}) as [string, string, string, string];
}

type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

interface ResolvedWord {
	word: string;
	partOfSpeech: PartOfSpeech;
}

function getWordBasedOnPreviousWord(
	letter: 'L' | 'G' | 'T' | 'M',
	previous?: ResolvedWord
): ResolvedWord {
	if (!previous) {
		return getWord(letter);
	}
	if (previous.partOfSpeech === 'adjective') {
		return getWordByPartOfSpeech(letter, 'noun');
	}
	if (previous.partOfSpeech === 'adverb') {
		return getWordByPartOfSpeech(letter, 'verb');
	}
	if (previous.partOfSpeech === 'verb') {
		return getWordByPartOfSpeech(letter, 'adjective');
	}
	if (previous.partOfSpeech === 'noun') {
		return getWordByPartOfSpeech(letter, 'adverb');
	}
	return getWord(letter);
}

function getWord(letter: 'L' | 'G' | 'T' | 'M'): ResolvedWord {
	const availableWords = dictionary[letter];
	const { word, partsOfSpeech } = randomIndex(availableWords.list);
	return {
		word,
		partOfSpeech: randomIndex(partsOfSpeech) as PartOfSpeech
	};
}

function getWordByPartOfSpeech(
	letter: 'L' | 'G' | 'T' | 'M',
	partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb'
): ResolvedWord {
	const availableWords = dictionary[letter].byPartOfSpeech[partOfSpeech];
	return {
		word: randomIndex(availableWords),
		partOfSpeech
	};
}

function randomIndex<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}
