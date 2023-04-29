import { POSTGRES_URL } from '$env/static/private';
import { createKysely } from '@vercel/postgres-kysely';
import type { Database } from './types.js';

export const db = createKysely<Database>({
	connectionString: POSTGRES_URL
});
