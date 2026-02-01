<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		options?: Array<{ value: string; label: string }>;
		children?: Snippet;
	}

	let { options, children }: Props = $props();
</script>

<select name="" id="">
	<button>
		<selectedcontent></selectedcontent>
	</button>
	{#each options as { value, label }}
		<option {value}>
			{label}
		</option>
	{:else}
		{@render children?.()}
	{/each}
</select>

<style lang="scss">
	@use '../../styles/abstracts/' as *;
	select {
		appearance: none;
		@supports (appearance: base-select) {
			&,
			&::picker(select) {
				appearance: base-select;
			}
		}
	}

	select:-moz-select-list-box {
		margin-top: 5px;
	}

	select {
		display: flex;
		justify-content: space-between;
		min-width: 300px;
		align-items: center;
		color: $clr-surface-900;
		padding: 10px 4px;
		border-radius: 4px;
		border: 1px solid $clr-surface-200;
		cursor: pointer;
		font-weight: 700;
		background: $clr-surface-000
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23FFF' class='size-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E%0A")
			right 10px center / 20px no-repeat;
		@supports (appearance: base-select) {
			background-image: none;
			&::picker-icon {
				content: '';
				width: 20px;
				height: 20px;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23FFF' class='size-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E%0A");
				transition: rotate 0.2s ease-out;
			}
			&:open::picker-icon {
				rotate: 180deg;
			}
			&::picker(select) {
				padding: 0;
				margin-top: 5px;
				border: 1px solid $clr-surface-200;
				background: white;
				border-radius: 5px;
				font-weight: 400;

				opacity: 0;
				height: 0;
				overflow: clip;
				transition:
					height 0.5s ease-out,
					opacity 0.5s ease-out,
					overlay 0.5s,
					display 0.5s;

				transition-behavior: allow-discrete;
			}
			&:open::picker(select) {
				opacity: 1;
				height: calc-size(auto, size);
				overflow: auto;
				@starting-style {
					opacity: 0;
					height: 0;
				}
			}
			option {
				padding: 10px;
				border-top: 1px solid $clr-surface-200;
				cursor: pointer;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				justify-content: space-between;
				transition-property: color, background;
				transition-duration: 0.2s;
				transition-timing-function: ease-out;
				&:where(:hover, :active) {
					background: $clr-brand-200;
					color: $clr-surface-900;
				}

				&:focus:not(:checked) {
					background: $clr-brand-300;
					color: $clr-surface-900;

					&::before {
						content: url('data:image/svg+xml,<svg width="11" height="5" viewBox="0 0 11 5" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(%23filter0_dd_2341_274)"><path d="M6.3463 4.46423L1.3463 2.46423L6.3463 0.464233" stroke="%236E31E5"/></g><defs><filter id="filter0_dd_2341_274" x="0" y="0" width="10.532" height="4.92847" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.321569 0 0 0 0 0.0980392 0 0 0 0 0.764706 0 0 0 1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2341_274"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="4"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.25098 0 0 0 0 0.0745098 0 0 0 0 0.596078 0 0 0 1 0"/><feBlend mode="normal" in2="effect1_dropShadow_2341_274" result="effect2_dropShadow_2341_274"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_2341_274" result="shape"/></filter></defs></svg>');
					}

					&::checkmark {
						display: none;
					}
				}

				&:checked {
					background: $clr-surface-000;
					color: $clr-surface-900;
				}
				&::checkmark {
					width: 16px;
					height: 16px;
					content: url('data:image/svg+xml,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3333 4L5.99999 11.3333L2.66666 8" stroke="%236E31E5" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>');
				}
				&:first-child {
					border: 0;
				}
			}
		}
	}
</style>
