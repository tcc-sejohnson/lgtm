import type { Generated } from 'kysely';

export interface LearnSubmissionsTable {
	id: Generated<number>;
	submitter_name: string;
	acronym: string;
	classification: 'good' | 'bad';
}

export interface Database {
	learn_submissions: LearnSubmissionsTable;
}
