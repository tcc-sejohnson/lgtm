<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/button';
	import { TextInput } from '$lib/text-input/index.js';
	import type { SubmitFunction } from './$types.js';

	export let data;
	export let form;

	let submitting = false;
	let selected: 'yes' | 'no' | 'sort-of' = 'no';

	const handleSubmit: SubmitFunction = async () => {
		submitting = true;
		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
			selected = (form?.selection as 'yes' | 'no' | 'sort-of') ?? 'no';
		};
	};

	$: name = (form?.name as string) ?? '';
</script>

<div class="content-wrapper">
	{#if !data.allowed}
		<form method="POST" action="?/authenticate" use:enhance={handleSubmit}>
			<div class="form-input">
				<label for="name">Name</label>
				<TextInput type="text" id="name" name="name" value={name ?? ''} />
				{#if form?.invalidName}
					<p class="error">Please provide your name.</p>
				{/if}
			</div>
			<div class="form-input">
				<label for="password">Password</label>
				<TextInput type="password" id="password" name="password" />
				{#if form?.invalidPassword}
					<p class="error">Incorrect password.</p>
				{/if}
			</div>
			<Button disabled={submitting} type="submit" variant="primary"
				>{submitting ? 'loading...' : 'submit'}</Button
			>
		</form>
	{:else}
		<form method="POST" action="?/train" use:enhance={handleSubmit}>
			<div class="acronym">
				Is "{data.acronym}" a good acronym?
			</div>
			<div class="form-input">
				<div class="radio-button">
					<input bind:group={selected} type="radio" id="yes" name="selection" value="yes" />
					<label for="yes">Yes</label>
				</div>
				<div class="radio-button">
					<!-- svelte-ignore a11y-autofocus -->
					<input bind:group={selected} autofocus type="radio" id="no" name="selection" value="no" />
					<label for="no">No</label>
				</div>
				<div class="radio-button">
					<input bind:group={selected} type="radio" id="sort-of" name="selection" value="sort-of" />
					<label for="sort-of">Not quite; let me fix it</label>
					<input
						class="hidden stretch"
						type="text"
						id="acronym"
						name="acronym"
						value={data.acronym ?? ''}
					/>
				</div>
			</div>
			{#if form?.invalidSelection}
				<div class="error">Please select one of the radio buttons.</div>
			{/if}
			{#if form?.invalidCustomMessage}
				<div class="error">{form.invalidCustomMessage}</div>
			{/if}
			<Button disabled={submitting} type="submit" variant="primary"
				>{submitting ? 'loading...' : 'submit'}</Button
			>
		</form>
	{/if}
</div>

<style>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--gap);
		min-height: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		border-radius: var(--border-radius-double);
		padding: var(--gap-double);
		border: 1px solid var(--accents-2);
		box-shadow: var(--shadow-small);
		background: var(--background);
	}

	.form-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: var(--gap-half);
	}

	.error {
		border: 1px solid red;
		background: rgba(255, 0, 0, 0.5);
		padding: var(--gap-half);
		border-radius: var(--border-radius);
	}

	p {
		margin: 0;
	}

	.hidden {
		display: none;
	}

	.stretch {
		margin-top: 8px;
		width: calc(100% - 8px);
	}

	input[type='text'] {
		border: 1px solid #ccc;
		border-radius: var(--border-radius);
		padding: var(--gap-half);
	}

	input[type='radio'][id='sort-of']:checked ~ input[type='text'] {
		display: block;
	}
</style>
