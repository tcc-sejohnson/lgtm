<script lang="ts">
	export let type: 'button' | 'submit' | 'reset';
	export let variant: 'primary' | 'secondary' = 'secondary';
	export let disabled = false;

	$: primary = variant === 'primary';
	$: secondary = variant === 'secondary';
</script>

<button on:click class:primary class:secondary {disabled} {type}><slot /></button>

<style>
	button {
		border-radius: var(--border-radius);
		padding: var(--gap-three-quarters);
		border: none;
		cursor: pointer;
		box-shadow: var(--shadow-small);
		transition-property: color, border, box-shadow;
		transition-duration: 0.15s;
		transition-timing-function: ease;
	}

	button.primary:disabled,
	button.secondary:disabled {
		color: var(--accents-4);
		background: var(--accents-2);
		cursor: not-allowed;
	}

	.secondary,
	.primary:hover {
		color: var(--foreground);
		background: var(--background);
	}

	.secondary:hover,
	.primary {
		background: var(--foreground);
		color: var(--background);
	}

	button:active:not(:disabled) {
		transform: scale(0.95);
	}
</style>
