<script lang="ts">
	import 'normalize.css';
	import '../app.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		height: 100vh;
		width: 100vw;
		font-size: 1.6rem;
		overflow: scroll;
		background: var(--accents-2);
	}
</style>
