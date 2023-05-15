<script lang="ts">
	import GoFile from 'svelte-icons/go/GoFile.svelte';
	import GoCloudUpload from 'svelte-icons/go/GoCloudUpload.svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { Toast } from '$lib/toast';

	let form: HTMLFormElement;
	let toastMessage: string | undefined;
	let timeout: number;

	function setToast(message: string) {
		toastMessage = message;
		clearTimeout(timeout);
		setTimeout(() => {
			toastMessage = undefined;
		}, 3000);
	}
</script>

<form
	bind:this={form}
	method="POST"
	action="/train?/upload"
	enctype="multipart/form-data"
	use:enhance={() => {
		setToast('uploading');
		return async ({ result }) => {
			if (result.type === 'redirect') {
				setToast('success');
				form.reset();
			} else {
				setToast('failure');
			}
		};
	}}
>
	<label>
		<input
			aria-label="Upload a file"
			type="file"
			name="file"
			accept=".txt"
			required
			on:change={(e) => {
				const file = e.currentTarget.files?.[0];

				if (file) {
					form.requestSubmit();
				}
			}}
		/>

		<div>
			<GoFile />
		</div>

		<button disabled={browser}>
			<GoCloudUpload />
		</button>
	</label>
</form>
{#if toastMessage}
	<Toast>{toastMessage}</Toast>
{/if}

<style>
	form {
		position: fixed;
		right: 8px;
		bottom: 12px;
		width: 32px;
		height: 32px;
	}

	div {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
	}

	label {
		cursor: pointer;
	}

	input[type='file'] {
		display: none;
	}

	button {
		display: none;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
	}

	/* in browsers without JS, the upload button is visible when the file input is populated */
	input[type='file']:valid ~ button:not(:disabled) {
		display: block;
	}
</style>
