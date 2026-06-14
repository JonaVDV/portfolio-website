<script lang="ts">
	import Button from '$components/Button/Button.svelte';
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
		closeButton,
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
	{#if header}
		{#if closeButton}
			<Button
				class="close-dialog"
				variant="stripped"
				commandfor={dialogId}
				command="close"
				data-testid="close-dialog-button"
				aria-label="Close dialog"
				onclick={handleClose}
			>
				<X />
			</Button>
		{/if}
		<div id="{dialogId}-header" class="dialog-header">
			{@render header?.()}
		</div>
	{/if}

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
		--_dialog-border-color: var(--dialog-border-color, var(--clr-surface-300, oklch(83.57% 0.00308 264.751)));
		--_dialog-max-width: var(--dialog-max-width, 30rem);
		--_dialog-max-height: var(--dialog-max-height, 90vh);
		--_dialog-box-shadow: var(--dialog-box-shadow, 0 10px 15px -3px rgb(0 0 0 / 0.1));

		/** --- Layout ---*/
		margin: auto;
		width: min(calc(100% - 2rem), var(--_dialog-max-width));
		max-height: min(calc(100% - 2rem), var(--_dialog-max-height));
		padding: var(--_dialog-padding);

		/** --- Appearance ---*/
		background: var(--_dialog-background);
		color: var(--_dialog-color);
		border: var(--_dialog-border-width) solid var(--_dialog-border-color);
		border-radius: var(--_dialog-border-radius);
		box-shadow: var(--_dialog-box-shadow);

		/** --- Behavior ---*/
		overflow: hidden;
		isolation: isolate;

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
	 * Positioned in the top-right corner of the dialog header
	 * Uses float to avoid disrupting flex/grid layouts
	 */
	dialog > :global(.close-dialog) {
		--_dialog-close-margin-inline-start: var(--dialog-close-margin-inline-start, 0.5rem);

		float: inline-end;
		margin-inline-start: var(--_dialog-close-margin-inline-start);
		z-index: 1;
	}
</style>
