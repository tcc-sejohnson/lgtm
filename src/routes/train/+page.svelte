<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	export let form;
</script>

<main>
	{#if !data.allowed}
		<form method="POST" action="?/authenticate" use:enhance>
			<div class="form-input">
				<label for="name">Name</label>
				<input type="text" id="name" name="name" value={form?.name ?? ''} />
				{#if form?.invalidName}
					<p class="error">Please provide your name.</p>
				{/if}
			</div>
			<div class="form-input">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" />
				{#if form?.invalidPassword}
					<p class="error">Incorrect password.</p>
				{/if}
			</div>
			<button type="submit">Submit</button>
		</form>
	{:else}
		<form method="POST" action="?/train" use:enhance>
			<div class="acronym">
				Is "{data.acronym}" a good acronym?
			</div>
			<div class="form-input">
				<div class="radio-button">
					<input
						type="radio"
						id="yes"
						name="selection"
						value="yes"
						checked={form?.selection === 'yes'}
					/>
					<label for="yes">Yes</label>
				</div>
				<div class="radio-button">
					<input
						type="radio"
						id="no"
						name="selection"
						value="no"
						checked={form?.selection === 'no'}
					/>
					<label for="no">No</label>
				</div>
				<div class="radio-button">
					<input
						type="radio"
						id="sort-of"
						name="selection"
						value="sort-of"
						checked={form?.selection === 'sort-of'}
					/>
					<label for="sort-of">Not quite, let me fix it</label>
					{#if form?.invalidSelection}
						<p class="error">Please select one of the radio buttons.</p>
					{/if}
					<input
						class="hidden stretch"
						type="text"
						id="acronym"
						name="acronym"
						value={data.acronym ?? ''}
					/>
					{#if form?.invalidCustomMessage}
						<p class="error">{form.invalidCustomMessage}</p>
					{/if}
				</div>
			</div>
			<button type="submit">Submit</button>
		</form>
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

	form {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-input {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.error {
		color: red;
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

	input[type='radio'][id='sort-of']:checked ~ input[type='text'] {
		display: block;
	}
</style>
