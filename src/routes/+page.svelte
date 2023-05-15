<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/button';
	import { ButtonLink } from '$lib/button-link';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { Toast } from '$lib/toast/index.js';
	import { browser } from '$app/environment';

	export let data;

	let showCopySuccess = false;
	let loading = false;

	$: currentOrientation = $page.url.searchParams.get('orientation') ?? 'along-y';
	$: currentId = $page.url.searchParams.get('id');

	// navigate here for a new acronym: /?orientation={currentOrientation}
	$: noAction = `/?${new URLSearchParams({
		orientation: currentOrientation
	})}`;

	// navigate here for the same acronym but rotated: /?orientation={opposite}&id={currentId}
	$: rotateAction = `/?${new URLSearchParams({
		orientation: currentOrientation === 'along-y' ? 'along-x' : 'along-y',
		...(currentId ? { id: currentId } : undefined)
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

	async function copy() {
		await navigator.clipboard.writeText(`\`\`\`\n${data.lgtm.replaceAll('&nbsp;', ' ')}\n\`\`\``);
		showCopySuccess = true;
		setTimeout(() => (showCopySuccess = false), 5000);
	}

	beforeNavigate(() => {
		loading = true;
	});

	afterNavigate(() => {
		loading = false;
	});
</script>

<div class="content-wrapper">
	<div class="constrain">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<pre class:center={currentOrientation === 'along-x'}><code on:click={onClickHighlight}
				>{@html data.lgtm}</code
			></pre>
		<div class="buttons">
			<ButtonLink disabled={loading} href={noAction}>no</ButtonLink>
			<Button
				disabled={loading || !browser}
				type="button"
				on:click={(e) => {
					e.preventDefault();
					copy();
				}}>yes (copy to clipboard)</Button
			>
			<ButtonLink disabled={loading} href={rotateAction}>yes but rotated</ButtonLink>
		</div>
	</div>
</div>

{#if showCopySuccess}
	<Toast>copied. go forth and merge</Toast>
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
</style>
