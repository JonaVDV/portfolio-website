<script lang="ts">
	import Button from '../Button/Button.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import X from '~icons/lucide/x';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		ref?: HTMLDialogElement | null;
		/**
		 * Whether the dialog is open.
		 * Reactive - bind to track dialog state externally.
		 */
		open?: boolean;
		/**
		 * The trigger that opens the dialog.
		 * Receives an object with `dialogId` and `triggerProps` that can be spread onto buttons.
		 *
		 * Example:
		 * ```svelte
		 * {#snippet trigger({ dialogId, triggerProps })}
		 *   <button {...triggerProps}>Open Dialog</button>
		 * {/snippet}
		 * ```
		 *
		 * The `triggerProps` object includes:
		 * - `commandfor`: The dialog ID for Invoker Commands API (modern browsers)
		 * - `command`: "show-modal" for native command support
		 * - `onclick`: Fallback handler for browsers without command API support
		 */
		trigger?: Snippet<
			[
				{
					/**
					 * The ID of the dialog.
					 */
					dialogId: string;
					/**
					 * Props to spread onto the trigger button.
					 * Includes commandfor, command, and onclick for progressive enhancement.
					 */
					triggerProps: {
						commandfor: string;
						command: 'show-modal';
						onclick: () => void;
					};
				}
			]
		>;
		/**
		 * Enable light dismiss (click outside to close).
		 * Uses the native `closedby="any"` attribute (Chrome 134+, Firefox 141+).
		 * Gracefully degrades to `closedby="closerequest"` (ESC key only) in unsupporting browsers.
		 */
		lightDismiss?: boolean;
		/**
		 * Show a built-in close button.
		 * Uses the native Invoker Commands API (`commandfor` + `command="close"`).
		 * Falls back to JavaScript event listeners in older browsers.
		 */
		closeButton?: boolean;
		/**
		 * The content of the dialog.
		 */
		children?: Snippet;
		/**
		 * Optional header snippet (useful for titles/descriptions).
		 */
		header?: Snippet;
		/**
		 * Optional footer snippet.
		 */
		footer?: Snippet;
	}

	let {
		trigger,
		children,
		closeButton = true,
		header,
		footer,
		ref = $bindable(null),
		open = $bindable(false),
		lightDismiss = true,
		...rest
	}: Props = $props();

	let dialogId = $props.id();

	/**
	 * Fallback close handler for browsers without Invoker Commands API support.
	 * Native `command="close"` will work without this in supported browsers.
	 */
	function handleClose() {
		ref?.close();
		open = false;
	}

	/**
	 * Fallback open handler for browsers without Invoker Commands API support.
	 * Native `command="show-modal"` will work without this in supported browsers.
	 */
	function handleOpen() {
		ref?.showModal();
		open = true;
	}

	/**
	 * Sync open state when dialog closes (via ESC, light dismiss, or close() call)
	 */
	function handleDialogClose() {
		open = false;
	}

	/**
	 * Track dialog's actual open state and sync with bindable open prop
	 */
	$effect.pre(() => {
		if (ref) {
			const isOpen = ref.open;
			if (open !== isOpen) {
				open = isOpen;
			}
		}
	});
</script>

{@render trigger?.({
	dialogId,
	triggerProps: {
		commandfor: dialogId,
		command: 'show-modal',
		onclick: handleOpen
	}
})}

<dialog
	{...rest}
	onclose={handleDialogClose}
	closedby={lightDismiss ? 'any' : 'closerequest'}
	id={dialogId}
	bind:this={ref}
	aria-labelledby={header ? `${dialogId}-header` : undefined}
>
	<div id="{dialogId}-header" class="dialog-header">
		{#if closeButton}
			<Button
				class="close-dialog"
				variant="stripped"
				data-dialog-close
				commandfor={dialogId}
				command="close"
				aria-label="Close dialog"
				onclick={handleClose}
			>
				<X />
			</Button>
		{/if}
		{#if header}
			{@render header?.()}
		{/if}
	</div>

	<div class="dialog-content">
		{@render children?.()}
	</div>

	{#if footer}
		<div class="dialog-footer">
			{@render footer?.()}
		</div>
	{/if}
</dialog>

<style>
	dialog:modal {
		/** --- Public Styling API --- */
		/** These variables can be overridden by consumers */
		--_dialog-background: var(--dialog-background, oklch(100% 0 0));
		--_dialog-color: var(--dialog-color, inherit);
		--_dialog-padding: var(--dialog-padding, 1.5rem);
		--_dialog-border-radius: var(--dialog-border-radius, 8px);
		--_dialog-border-width: var(--dialog-border-width, 1px);
		--_dialog-border-color: var(
			--dialog-border-color,
			var(--clr-surface-300, oklch(83.57% 0.00308 264.751))
		);
		--_dialog-max-width: var(--dialog-max-width, 30rem);
		--_dialog-spacing: var(--dialog-spacing, 1.5rem);
		--_dialog-max-height: var(--dialog-max-height, 90vh);
		--_dialog-box-shadow: var(--dialog-box-shadow, 0 10px 15px -3px rgb(0 0 0 / 0.1));

		/** Header */
		--_dialog-header-background: var(--dialog-header-background, inherit);
		--_dialog-header-color: var(--dialog-header-color, inherit);
		--_dialog-header-padding: var(--dialog-header-padding, var(--_dialog-padding));
		--_dialog-header-border-bottom: var(--dialog-header-border-bottom, none);
		--_dialog-header-gap: var(--dialog-header-gap, 0.5rem);
		--_dialog-header-align: var(--dialog-header-align, center);

		/** Content */
		--_dialog-content-background: var(--dialog-content-background, inherit);
        --_dialog-content-padding: var(--dialog-content-padding, var(--_dialog-padding));

		/** Footer */
		--_dialog-footer-background: var(--dialog-footer-background, inherit);
		--_dialog-footer-color: var(--dialog-footer-color, inherit);
		--_dialog-footer-padding: var(--dialog-footer-padding, var(--_dialog-padding));
		--_dialog-footer-border-top: var(--dialog-footer-border-top, none);
		--_dialog-footer-gap: var(--dialog-footer-gap, 0.75rem);
		--_dialog-footer-justify: var(--dialog-footer-justify, flex-end);

		/** --- Layout ---*/
		margin: auto;
		width: min(calc(100% - 2rem), var(--_dialog-max-width));
		max-height: min(calc(100% - 2rem), var(--_dialog-max-height));
		padding: 0; /** Padding moved to sub-elements for edge-to-edge borders */

		/** --- Appearance ---*/
		background: var(--_dialog-background);
		color: var(--_dialog-color);
		border: var(--_dialog-border-width) solid var(--_dialog-border-color);
		border-radius: var(--_dialog-border-radius);
		box-shadow: var(--_dialog-box-shadow);

		/** --- Behavior ---*/
		overflow: hidden;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		gap: var(--_dialog-spacing);

		/** --- Transitions ---*/
		/** Modern CSS: allow transitions on display property (all browsers except firefox) */
		transition-behavior: allow-discrete;
		opacity: 0;
		transition:
			opacity 0.2s ease-in-out,
			display 0.2s,
			overlay 0.2s;

		&[open] {
			opacity: 1;
		}
	}

	.dialog-header {
		background: var(--_dialog-header-background);
		color: var(--_dialog-header-color);
		padding: var(--_dialog-header-padding);
		padding-bottom: 0;
		border-bottom: var(--_dialog-header-border-bottom);
		gap: var(--_dialog-header-gap);
		position: relative;
	}

	.dialog-content {
		background: var(--_dialog-content-background);
		padding-inline: var(--_dialog-content-padding);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.dialog-footer {
		background: var(--_dialog-footer-background);
		color: var(--_dialog-footer-color);
		padding: var(--_dialog-footer-padding);
		padding-top: 0;
		border-top: var(--_dialog-footer-border-top);
		display: flex;
		justify-content: var(--_dialog-footer-justify);
		gap: var(--_dialog-footer-gap);
	}

	/**
	 * Backdrop - semi-transparent overlay behind the dialog
	 * Smooth transition with the dialog itself for cohesive UX
	 */
	dialog::backdrop {
		--_dialog-backdrop-background: var(--dialog-backdrop-background, hsl(0 0% 0% / 0.5));
		--_dialog-backdrop-blur: var(--dialog-backdrop-blur, 4px);

		background-color: var(--_dialog-backdrop-background);
		backdrop-filter: blur(var(--_dialog-backdrop-blur));

		transition-behavior: allow-discrete;
		transition:
			opacity 0.2s ease-in-out,
			overlay 0.2s;
	}

	/**
	 * Entry animation
	 * Defines the starting state before the dialog opens
	 * Used by @starting-style in modern browsers
	 */
	@starting-style {
		dialog[open] {
			opacity: 0;
		}

		dialog::backdrop {
			opacity: 0;
		}
	}

	/**
	 * Close Button
	 * Positioned in the top-right corner of the dialog
	 * Explicitly positioned to avoid header content collision
	 */
	dialog:modal :global([data-dialog-close]) {
		--_dialog-close-margin: var(--dialog-close-margin, 0.5rem);

		float: inline-end;
        margin-inline-start: var(--_dialog-close-margin);
		z-index: 2;
	}
</style>
