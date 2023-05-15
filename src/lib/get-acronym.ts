import { sql } from 'kysely';
import { db } from './db';

export interface LGTMResponse {
	id: string;
	l: string;
	g: string;
	t: string;
	m: string;
}

function getRandomAcronym(): Promise<LGTMResponse> {
	return db
		.selectFrom('acronyms')
		.selectAll()
		.orderBy(sql`random()`)
		.executeTakeFirstOrThrow();
}

export async function getAcronym(id?: string): Promise<LGTMResponse> {
	if (id) {
		const result = await db
			.selectFrom('acronyms')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
		if (result) return result;
	}

	return getRandomAcronym();
}
