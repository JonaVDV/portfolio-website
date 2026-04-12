<script lang="ts">
	import Popover, { type PopoverPosition } from '$components/Popover/popover.svelte';
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		trigger: Snippet<[{ props: HTMLButtonAttributes }]>;
		children: Snippet;
		position?: PopoverPosition;
		hasArrow?: boolean;
	};

	const keyboardNavigate: Attachment<HTMLDivElement> = (node) => {
		node.addEventListener('keydown', (event) => {
			if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
				return;
			}

			const focusableElements = Array.from(
				node.querySelectorAll<HTMLElement>(
					'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
				)
			).filter((element) => !element.hasAttribute('disabled') && element.tabIndex >= 0);

			if (!focusableElements.length) {
				return;
			}

			event.preventDefault();

			const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
			let nextIndex = currentIndex;

			switch (event.key) {
				case 'ArrowDown':
					nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % focusableElements.length;
					break;
				case 'ArrowUp':
					nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = focusableElements.length - 1;
					break;
			}

			focusableElements[nextIndex]?.focus();
		});
	};

	let {
		trigger: triggerSnippet,
		children: childrenSnippet,
		position = 'bottom end',
		hasArrow = false
	}: Props = $props();
</script>

<Popover trigger={triggerSnippet} {position} {hasArrow} --popover-offset="12px">
	<div class="dropdown-menu" {@attach keyboardNavigate}>
		{@render childrenSnippet?.()}
	</div>
</Popover>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.dropdown-menu {
		display: grid;
		gap: 0.25rem;
		min-inline-size: 14rem;
		padding: 0.5rem;
		background-color: var(--dropdown-menu-background, $clr-surface-000);
		border: 1px solid var(--dropdown-menu-border, $clr-surface-200);
		border-radius: 1rem;
	}

	:global(.dropdown-menu hr) {
		--separator-margin: 0.25rem 0;
		--separator-color: var(--dropdown-menu-separator, $clr-surface-200);
	}
</style>
