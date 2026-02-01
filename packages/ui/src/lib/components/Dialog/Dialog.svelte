<script lang="ts">
	import Button from '$components/Button/Button.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/**
		 * The trigger that opens the dialog.
		 */
		trigger?: Snippet<
			[
				{
					/**
					 * Whether the dialog is open.
					 */
					open: boolean;
					/**
					 * The ID of the dialog.
					 */
					dialogId: string;
					/**
					 * Function to open the dialog.
					 * this is useful when you want to open the dialog with javaScript.
					 * @returns void
					 */
					openFn: () => void;
				}
			]
		>;
		lightDismiss?: boolean;
		/**
		 * The content of the dialog.
		 */
		children?: Snippet<
			[
				{
					/*Whether the dialog is open. */ open: boolean;
				}
			]
		>;
		footer?: Snippet<
			[
				{
					/*Whether the dialog is open. */ open: boolean;
				}
			]
		>;
	}

	let { trigger, children, footer, lightDismiss, ...rest }: Props = $props();

	let dialogId = $props.id();

	let element = $state<HTMLDialogElement | null>(null);

	function close() {
		if (!open || !element?.open) return;
		element?.close();
		open = false;
	}

	function openDialog() {
		if (open || element?.open) return;
		element?.showModal();
		open = true;
	}

	let open = $state(false);
</script>

{@render trigger?.({ open, dialogId, openFn: openDialog })}

<dialog
	onclose={() => (open = false)}
	closedby={lightDismiss ? 'any' : 'closerequest'}
	id={dialogId}
	bind:this={element}
	{...rest}
>
	<Button
		class="close-dialog"
		variant="stripped"
		commandfor={dialogId}
		command="request-close"
		data-testid="close-dialog-button"
		aria-label="Close dialog"
		onclick={close}
	>
		<!-- Replace with icon later -->
		X
	</Button>
	<div class="dialog-content">
		{@render children?.({ open })}
	</div>

	<div class="dialog-footer">
		{@render footer?.({ open })}
	</div>
</dialog>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	dialog:modal {
	}
</style>
