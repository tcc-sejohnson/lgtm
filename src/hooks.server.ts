import { SESSION_SECRET } from '$env/static/private';
import { handleSession } from 'svelte-kit-cookie-session';

export const handle = handleSession({
	init: () => ({
		authenticated: false
	}),
	secret: SESSION_SECRET
});
