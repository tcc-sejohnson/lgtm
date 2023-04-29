<script lang="ts">
	export let type: 'text' | 'password';
	export let id: string;
	export let name: string;
	export let value: string | undefined = undefined;
</script>

<input {type} {value} {id} {name} />

<style>
	input {
		border: 1px solid #ccc;
		border-radius: var(--border-radius);
		padding: var(--gap-half);
	}
</style>
