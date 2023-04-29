<script lang="ts">
	export let type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
	export let value: HTMLInputElement['value'];
</script>

<input {type} {value} />

<style>
	input {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.5rem;
		font-size: 1rem;
	}
</style>
