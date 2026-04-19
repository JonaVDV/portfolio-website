<script lang="ts">
	import type { PopoverPosition } from '$components/Popover/popover.svelte';
	import Popover from '$components/Popover/popover.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<ComponentProps<typeof Popover>, 'position'> {
		content: string | Snippet;
		openOnHover?: boolean;
		openDelay?: number;
		closeDelay?: number;
		skipDelayDuration?: number;
		position?: PopoverPosition;
	}

	let {
		children: childrenProp,
		trigger: triggerProp,
		content,
		openOnHover = true,
		openDelay = 500,
		closeDelay = 150,
		skipDelayDuration = 300,
		position,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	let openTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let lastCloseAt = 0;

	function clearTimers() {
		if (openTimer) clearTimeout(openTimer);
		if (closeTimer) clearTimeout(closeTimer);
		openTimer = undefined;
		closeTimer = undefined;
	}

	function openPopover() {
		clearTimers();
		if (ref && !ref.matches(':popover-open')) {
			ref.showPopover();
		}
	}

	function closePopover() {
		clearTimers();
		if (ref && ref.matches(':popover-open')) {
			ref.hidePopover();
		}
		lastCloseAt = Date.now();
	}

	function scheduleOpen() {
		clearTimeout(closeTimer);

		const elapsed = Date.now() - lastCloseAt;
		const delay = elapsed < skipDelayDuration ? 0 : openDelay;

		openTimer = setTimeout(() => {
			openPopover();
		}, delay);
	}

	function scheduleClose() {
		clearTimeout(openTimer);
		closeTimer = setTimeout(() => {
			closePopover();
		}, closeDelay);
	}
</script>

<Popover
	bind:ref
	onpointerenter={openOnHover ? scheduleOpen : undefined}
	onpointerleave={openOnHover ? scheduleClose : undefined}
	popover="hint"
	{position}
	{...rest}
>
	{#snippet trigger({ props })}
		{@render triggerProp({
			props: {
				onpointerenter: openOnHover ? scheduleOpen : undefined,
				onpointerleave: openOnHover ? scheduleClose : undefined,
				onfocus: openPopover,
				onblur: closePopover,
				...props
			}
		})}
	{/snippet}
	{#if typeof content === 'string'}
		{content}
	{:else}
		{@render content()}
	{/if}
</Popover>
