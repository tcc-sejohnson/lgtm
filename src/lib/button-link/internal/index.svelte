<script lang="ts">
	export let href: string;
	export let variant: 'primary' | 'secondary' = 'secondary';
	export let disabled = false;

	$: primary = variant === 'primary';
	$: secondary = variant === 'secondary';
</script>

<a class:primary class:secondary class:disabled href={disabled ? undefined : href}><slot /></a>

<style>
	a {
		border-radius: var(--border-radius);
		padding: var(--gap-three-quarters);
		border: none;
		cursor: pointer;
		box-shadow: var(--shadow-small);
		transition: 0.15s ease all;
		text-align: center;
		text-decoration: none;
	}

	a.primary.disabled,
	a.secondary.disabled {
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

	a:active {
		transform: scale(0.95);
	}
</style>
