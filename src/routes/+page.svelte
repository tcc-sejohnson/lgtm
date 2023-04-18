<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	$: currentOrientation = $page.url.searchParams.get('orientation') ?? 'along-x';
	$: currentSeed = $page.url.searchParams.get('seed');
	$: noAction = `/?${new URLSearchParams({
		orientation: currentOrientation
	})}`;
	$: rotateAction = `/?${new URLSearchParams({
		orientation: currentOrientation === 'along-x' ? 'along-y' : 'along-x',
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

	function copy() {
		navigator.clipboard.writeText(`\`\`\`\n${data.lgtm.replaceAll('&nbsp;', '')}\n\`\`\``);
	}
</script>

<main>
	<pre>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <code on:click={onClickHighlight}>{@html data.lgtm}</code>
  </pre>
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
		<input name="orientation" value={currentOrientation === 'along-x' ? 'along-y' : 'along-x'} />
		<button type="submit">yes but rotated</button>
	</form>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		flex-direction: column;
		gap: 16px;
	}

	form {
		display: contents;
	}

	input {
		display: none;
	}

	pre {
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
</style>
