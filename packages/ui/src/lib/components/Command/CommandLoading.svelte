<li class="command-loading" role="presentation" aria-label="Loading...">
	<span class="command-loading-spinner" aria-hidden="true"></span>
</li>

<style>
	.command-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem 1rem;
		list-style: none;
	}

	.command-loading-spinner {
		inline-size: 1.25rem;
		block-size: 1.25rem;
		border: 2px solid oklch(88% 0.005 250);
		border-block-start-color: oklch(45% 0.15 250);
		border-radius: 50%;
		animation: command-spin 0.6s linear infinite;
	}

	@keyframes command-spin {
		to {
			rotate: 1turn;
		}
	}
</style>
