<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/button';

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
		await navigator.clipboard.writeText(`\`\`\`\n${data.lgtm.replaceAll('&nbsp;', ' ')}\n\`\`\``);
		showCopySuccess = true;
		setTimeout(() => (showCopySuccess = false), 5000);
	}
</script>

<div class="content-wrapper">
	<div class="constrain">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<pre class:center={currentOrientation === 'along-x'}><code on:click={onClickHighlight}
				>{@html data.lgtm}</code
			></pre>
		<div class="buttons">
			<form method="get" on:submit={enhanceNo}>
				<input name="orientation" value={currentOrientation} />
				<Button type="submit">no thanks</Button>
			</form>
			<form
				on:submit={(e) => {
					e.preventDefault();
					copy();
				}}
			>
				<Button type="submit">yes (copy to clipboard)</Button>
			</form>
			<form method="get" on:submit={enhanceRotate}>
				<input name="seed" value={currentSeed} />
				<input
					name="orientation"
					value={currentOrientation === 'along-y' ? 'along-x' : 'along-y'}
				/>
				<Button type="submit">yes but rotated</Button>
			</form>
		</div>
	</div>
</div>
{#if showCopySuccess}
	<div class="copy-success-toast">
		<span class="copy-success-toast-content">copied. go forth and merge</span>
	</div>
{/if}

<style>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--gap);
		min-height: 100%;
	}

	.constrain {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--gap);
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	form {
		display: contents;
	}

	input {
		display: none;
	}

	pre.center {
		text-align: center;
	}

	pre {
		overflow: auto;
		border-radius: var(--border-radius-double);
		padding: var(--gap-double);
		border: 1px solid var(--accents-2);
		box-shadow: var(--shadow-small);
		background: var(--background);
		margin: 0;
		max-width: 400px;
		min-width: 160px;
	}

	pre > code {
		display: block;
		font-size: 1.6rem;
	}

	.copy-success-toast {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		width: 100%;
		bottom: var(--gap);
	}

	.copy-success-toast-content {
		color: black;
		border-radius: var(--border-radius);
		background: var(--success);
		padding: 8px;
		box-shadow: var(--shadow-small);
	}
</style>
