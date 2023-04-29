<script lang="ts">
	export let type: 'button' | 'submit' | 'reset';
</script>

<button {type}><slot /></button>

<style>
	button {
		color: var(--foreground);
		border-radius: var(--border-radius);
		background: var(--background);
		padding: var(--gap-three-quarters);
		border: none;
		cursor: pointer;
		transition: 0.15s ease all;
		box-shadow: var(--shadow-small);
	}

	button:hover {
		background: var(--foreground);
		color: var(--background);
	}

	button:active {
		transform: scale(0.95);
	}
</style>
