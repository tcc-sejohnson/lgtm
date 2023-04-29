import type { Session } from 'svelte-kit-cookie-session';

interface SessionData {
	authenticated: boolean;
	name?: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session<SessionData>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
