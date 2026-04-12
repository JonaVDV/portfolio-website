<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Popover from './popover.svelte';

	const { Story } = defineMeta({
		title: 'components/Popover',
		component: Popover,
		tags: ['autodocs'],
		argTypes: {
			position: {
				control: { type: 'text' },
				description:
					'Any valid position-area value, including compound values such as "top left" or "block-start inline-end".'
			},
			hasArrow: {
				control: { type: 'boolean' },
				defaultValue: true
			},
			children: {
				control: { type: 'text' }
			}
		}
	});
</script>

<Story name="Top" args={{ position: 'top' }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover appears <strong>above</strong> the trigger.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Bottom" args={{ position: 'bottom' }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover appears <strong>below</strong> the trigger.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Left" args={{ position: 'left' }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover appears to the <strong>left</strong>.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Right" args={{ position: 'right' }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover appears to the <strong>right</strong>.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Top left" args={{ position: 'top left' }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover uses a compound position area.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Without arrow" args={{ position: 'top', hasArrow: false }}>
	{#snippet template(args)}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position={args.position} hasArrow={args.hasArrow}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}
				This popover has no arrow.
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Multiple popovers">
	{#snippet template()}
		<div style="display: grid; place-content: center; block-size: 100svh; gap: 1rem;">
			<Popover position="top">
				{#snippet trigger({ props })}
					<button {...props}>Top</button>
				{/snippet}
				Popover on top
			</Popover>
			<Popover position="bottom">
				{#snippet trigger({ props })}
					<button {...props}>Bottom</button>
				{/snippet}
				Popover on bottom
			</Popover>
			<Popover position="left">
				{#snippet trigger({ props })}
					<button {...props}>Left</button>
				{/snippet}
				Popover on the left
			</Popover>
			<Popover position="right">
				{#snippet trigger({ props })}
					<button {...props}>Right</button>
				{/snippet}
				Popover on the right
			</Popover>
		</div>
	{/snippet}
</Story>

<Story name="Overflow handling">
	{#snippet template()}
		<div
			style="display: grid; place-items: center; block-size: 200px; overflow: auto; border: 2px solid var(--clr-surface-300);"
		>
			<div style="block-size: 400px; display: grid; place-items: center;">
				<Popover position="top">
					{#snippet trigger({ props })}
						<button {...props}>Hover me</button>
					{/snippet}
					This popover tries to appear above, but there's not enough space, so it flips to the bottom.
				</Popover>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Rich content">
	{#snippet template()}
		<div style="display: grid; place-items: center; block-size: 200px;">
			<Popover position="top">
				{#snippet trigger({ props })}
					<button {...props}>Open popover</button>
				{/snippet}
				<p style="margin: 0 0 0.5rem">Any <strong>rich</strong> content goes here.</p>
				<button onclick={() => alert('clicked!')}>A button inside</button>
			</Popover>
		</div>
	{/snippet}
</Story>
