<script lang="ts">
	import Dialog from './Dialog.svelte';
	import Button from '$components/Button/Button.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		ref?: HTMLDialogElement | null;
		/**
		 * Whether the alert dialog is open.
		 * Reactive - bind to track dialog state externally.
		 */
		open?: boolean;
		/**
		 * The trigger that opens the alert dialog.
		 * Receives `triggerProps` that can be spread onto buttons for progressive enhancement.
		 *
		 * Example:
		 * ```svelte
		 * {#snippet trigger({ triggerProps })}
		 *   <button {...triggerProps}>Delete Account</button>
		 * {/snippet}
		 * ```
		 */
		trigger?: Snippet<
			[
				{
					triggerProps: {
						commandfor: string;
						command: 'show-modal';
						onclick: () => void;
					};
				}
			]
		>;
		/**
		 * The title of the alert dialog.
		 */
		title: string;
		/**
		 * The description/content of the alert dialog.
		 */
		description?: string;
		/**
		 * Custom content if description string is not enough.
		 */
		children?: Snippet;
		/**
		 * The action button snippet (e.g. Delete, Confirm).
		 */
		action?: Snippet;
		/**
		 * Text for the cancel button.
		 */
		cancelText?: string;
	}

	let {
		trigger,
		title,
		description,
		children,
		action,
		cancelText = 'Cancel',
		ref = $bindable(null),
		open = $bindable(false),
		...rest
	}: Props = $props();

	let dialogId = $props.id();
</script>

<Dialog
	{trigger}
	bind:ref
	bind:open
	id={dialogId}
	class="alert-dialog"
	{...rest}
	role="alertdialog"
	aria-labelledby="{dialogId}-title"
	aria-describedby={description ? `${dialogId}-description` : undefined}
	closeButton
>
	{#snippet header()}
		<div class="alert-dialog-content">
			<div class="alert-dialog-icon" aria-hidden="true">
				<!-- inlined lucide/circle-alert — keeps the package free of icon build tooling -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" x2="12" y1="8" y2="12" />
					<line x1="12" x2="12.01" y1="16" y2="16" />
				</svg>
			</div>
			<div class="alert-dialog-text">
				<h2 id="{dialogId}-title" class="alert-dialog-title">{title}</h2>
				{#if description}
					<p id="{dialogId}-description" class="alert-dialog-description">{description}</p>
				{/if}
				{#if children}
					<div class="alert-dialog-custom-content">
						{@render children?.()}
					</div>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="alert-dialog-footer flex-group">
			<Button variant="outline" commandfor={dialogId} command="close">
				{cancelText}
			</Button>
			{@render action?.()}
		</div>
	{/snippet}
</Dialog>

<style>
	/**
	 * AlertDialog Styling
	 *
	 * The AlertDialog is a specialized Dialog for confirmation and warning messages.
	 * It combines semantic HTML (dialog + role="alertdialog") with accessible patterns.
	 *
	 * Key characteristics:
	 * - Role="alertdialog" for screen reader announcement
	 * - Consistent max-width for alert-appropriate sizing
	 * - Icon + text layout using flex for semantic flow
	 * - Footer buttons with clear action/cancel distinction
	 */

	:global(.alert-dialog) {
		/* Override dialog defaults for alert-appropriate sizing */
		--dialog-max-width: 32rem;
	}

	/**
	 * Alert Content Container
	 * Uses flexbox for semantic icon + text layout
	 * Icon is visually left-aligned and doesn't wrap
	 */
	.alert-dialog-content {
		display: flex;
		align-items: flex-start;
		gap: 1.5rem;
	}

	/**
	 * Alert Icon
	 * Flex-shrink: 0 prevents icon from collapsing
	 * Uses semantic color (destructive red-ish)
	 */
	.alert-dialog-icon {
		flex-shrink: 0;
		color: var(--alert-icon-color, oklch(0.6 0.2 25));
		font-size: 1.5rem;
	}

	/**
	 * Text Container
	 * Uses flow utility for consistent vertical spacing
	 * (From STYLE.md: .flow adds margin-block-start to non-first-children)
	 */
	.alert-dialog-text {
		--flow-spacer: 0.5rem;
	}

	/**
	 * Alert Title
	 * Semantic heading with typography for prominence
	 */
	.alert-dialog-title {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
		margin: 0;
	}

	/**
	 * Alert Description
	 * Uses relative color manipulation (oklch `from` keyword)
	 * Reduces opacity for secondary emphasis
	 * Gracefully degrades in browsers without oklch `from` support
	 */
	.alert-dialog-description {
		color: oklch(from currentColor l c h / 0.8);
		font-size: 0.9375rem;
		margin: 0;
	}

	/**
	 * Custom Content Wrapper
	 * Applies consistent margin when non-description children are rendered
	 */
	.alert-dialog-custom-content {
		margin-top: 0.5rem;
	}

	/**
	 * Alert Footer
	 * Uses flex-group utility for consistent button layout
	 * justify-content: flex-end aligns buttons to the right (action-focused)
	 * (From STYLE.md: flex-group provides responsive gap and alignment)
	 */
	.alert-dialog-footer {
		justify-content: flex-end;
		margin-top: 1.5rem;
	}
</style>
