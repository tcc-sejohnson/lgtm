<script lang="ts">
	import '../app.css';
	import 'normalize.css';
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
