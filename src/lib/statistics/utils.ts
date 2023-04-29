import L from '$lib/statistics/dictionaries/l';
import G from '$lib/statistics/dictionaries/g';
import T from '$lib/statistics/dictionaries/t';
import M from '$lib/statistics/dictionaries/m';

export function getRandomElement<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function generateAcronym(): string {
	return `${getRandomElement(L)} ${getRandomElement(G)} ${getRandomElement(T)} ${getRandomElement(
		M
	)}`;
}
