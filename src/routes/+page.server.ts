import fs from 'fs';

export function load() {
	const data = fs.readFileSync('/Users/elliottjohnson/dev/me/lgtm/src/lib/database.json', 'utf8');
	const json = JSON.parse(data);
	const found = new Set<string>();
	// const modified = json.filter((mystery: any) => {
	// 	const { word } = mystery as { word: string };
	// 	if (found.has(word)) return false;
	// 	if (word[0] !== word[0].toUpperCase()) return false;
	// 	found.add(word);
	// 	return true;
	// });
	// fs.writeFileSync(
	// 	'/Users/elliottjohnson/dev/me/lgtm/src/lib/database.json',
	// 	JSON.stringify(modified, null, 2),
	// 	'utf8'
	// );
	const keys = new Set<string>();
	const types = new Set<string>();
	console.log(json.length);
	for (const mystery of json) {
		for (const key of Object.keys(mystery)) {
			keys.add(key);
		}
		types.add(mystery.type);
	}
	console.log(keys);
	console.log(types);
}
