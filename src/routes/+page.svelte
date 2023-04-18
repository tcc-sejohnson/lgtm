<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	let showCopySuccess = false;

	$: currentOrientation = $page.url.searchParams.get('orientation') ?? 'along-y';
	$: currentSeed = $page.url.searchParams.get('seed');
	$: noAction = `/?${new URLSearchParams({
		orientation: currentOrientation
	})}`;
	$: rotateAction = `/?${new URLSearchParams({
		orientation: currentOrientation === 'along-y' ? 'along-x' : 'along-y',
		...(currentSeed ? { seed: currentSeed } : undefined)
	})}`;

	function onClickHighlight(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLElement;
		}
	) {
		e.preventDefault();
		const selection = window.getSelection();
		if (selection) {
			selection.selectAllChildren(e.currentTarget);
			return;
		}
	}

	async function enhanceNo(
		e: Event & {
			readonly submitter: HTMLElement | null;
		} & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		e.preventDefault();
		await goto(noAction);
	}

	async function enhanceRotate(
		e: Event & {
			readonly submitter: HTMLElement | null;
		} & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		e.preventDefault();
		await goto(rotateAction);
	}

	async function copy() {
		await navigator.clipboard.writeText(`\`\`\`\n${data.lgtm.replaceAll('&nbsp;', '')}\n\`\`\``);
		showCopySuccess = true;
		setTimeout(() => (showCopySuccess = false), 5000);
	}
</script>

<main>
	<div class="content-wrapper">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<pre><code on:click={onClickHighlight}>{@html data.lgtm}</code></pre>
		<form method="get" on:submit={enhanceNo}>
			<input name="orientation" value={currentOrientation} />
			<button type="submit">no</button>
		</form>
		<form
			on:submit={(e) => {
				e.preventDefault();
				copy();
			}}
		>
			<button type="submit">yes (copy to clipboard)</button>
		</form>
		<form method="get" on:submit={enhanceRotate}>
			<input name="seed" value={currentSeed} />
			<input name="orientation" value={currentOrientation === 'along-y' ? 'along-x' : 'along-y'} />
			<button type="submit">yes but rotated</button>
		</form>
	</div>
	{#if showCopySuccess}
		<div class="copy-success-toast">
			<span class="copy-success-toast-content">copied. go forth and merge</span>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
		min-width: 200px;
	}

	form {
		display: contents;
	}

	form > button {
		min-width: 150px;
	}

	input {
		display: none;
	}

	pre {
		align-self: stretch;
		display: block;
		width: auto;
		overflow: auto;
		background-color: #eee;
		border-radius: 10px;
		border: 1px solid;
		border-color: #111;
		padding: 30px;
		margin: 0;
	}

	pre > code {
		display: block;
		font-size: 1rem;
		text-indent: 0;
		color: #111;
		white-space: inherit;
	}

	.copy-success-toast {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		width: 100%;
		bottom: 8px;
	}

	.copy-success-toast-content {
		border-radius: 4px;
		padding: 8px;
		border: 1px solid black;
	}
</style>
