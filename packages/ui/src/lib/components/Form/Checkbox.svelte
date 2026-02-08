<script lang="ts">
	import { draw } from 'svelte/transition';

	let checked: boolean = $state(false);
</script>

<div>
	<input type="checkbox" bind:checked />
	<div class="checked">
		{#key checked}
			<svg
				fill="none"
				width="20"
				height="20"
				viewBox="0 0 20 20"
				style:display={checked ? 'inline' : 'none'}
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					transition:draw={{ duration: 400 }}
					d="M12.1549 1L1 9.80851L4.92958 9.17021L13.2958 3.93617L5.1831 10.1915L18.3662 6.23404L4.92958 15.4255L19 9.80851L5.8169 17.9787L18.3662 14.2766L13.5493 17.5957L18.3662 16.3191L17.3521 19L19 18.234"
					stroke="#6E31E5"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/key}
	</div>
</div>

<noscript>
	<style>
		input[type='checkbox']:checked {
			content: url("data:image/svg+xml,%3Csvg class='checked' fill='none' width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.1549 1L1 9.80851L4.92958 9.17021L13.2958 3.93617L5.1831 10.1915L18.3662 6.23404L4.92958 15.4255L19 9.80851L5.8169 17.9787L18.3662 14.2766L13.5493 17.5957L18.3662 16.3191L17.3521 19L19 18.234' stroke='%236E31E5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		}
	</style>
</noscript>

<style lang="scss">
	@use '../../styles/abstracts/' as *;
	input[type='checkbox'] {
		--checkbox-border: 1px solid #{$clr-surface-200};
		--checkbox-size: 1.25rem;
		width: var(--checkbox-size);
		aspect-ratio: 1/1;
		appearance: none;
		border: var(--checkbox-border);
		anchor-name: --checkbox;
		&:hover {
			--checkbox-border: 1px solid #{$clr-brand-200};
		}

		&:focus-visible {
			--checkbox-border: 1px solid #{$clr-brand-300};
			outline: 0;
		}

		&:checked {
			--checkbox-border: 1px solid #{$clr-brand-500};
		}
	}

	.checked {
		--checkmark-offset-top: -0.125rem;
		--checkmark-offset-left: -0.125rem;
		margin-block-start: var(--checkmark-offset-top);
		margin-inline-start: var(--checkmark-offset-left);
		display: inline-flex;
		position: absolute;
		position-anchor: --checkbox;
		position-area: center center;
		pointer-events: none;
	}
</style>
