<div class="copy-success-toast">
	<span class="copy-success-toast-content"><slot /></span>
</div>

<style>
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
