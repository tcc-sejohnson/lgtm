import type { Generated, ColumnType } from 'kysely';

export interface LearnSubmissionsTable {
	id: Generated<number>;
	submitter_name: string;
	acronym: string;
	classification: 'good' | 'bad';
	processed: ColumnType<boolean, boolean | null, boolean | null>;
}

export interface AcronymsTable {
	id: Generated<string>;
	l: string;
	g: string;
	t: string;
	m: string;
	added_at: ColumnType<string, never, never>;
}

export interface Database {
	learn_submissions: LearnSubmissionsTable;
	acronyms: AcronymsTable;
}
