<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tooltip from './Tooltip.svelte';

	const { Story } = defineMeta({
		title: 'Components/Tooltip',
		component: Tooltip
	});
</script>

<Story name="Position-try bottom">
	{#snippet template(args)}
		<div class="wrapper">
			<Tooltip {...args} position="bottom">
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}

				{#snippet content()}
					<p>This is a tooltip!</p>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>

<Story name="Position-try left">
	{#snippet template(args)}
		<div class="wrapper">
			<Tooltip position="left" {...args}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}

				{#snippet content()}
					<p>This is a tooltip!</p>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>

<Story name="Position-try right">
	{#snippet template(args)}
		<div class="wrapper">
			<Tooltip position="right" {...args}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}

				{#snippet content()}
					<p>This is a tooltip!</p>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>

<Story name="Position-try top">
	{#snippet template(args)}
		<div class="wrapper">
			<Tooltip position="top" {...args}>
				{#snippet trigger({ props })}
					<button {...props}>Hover me</button>
				{/snippet}

				{#snippet content()}
					<p>This is a tooltip!</p>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>

<Story name="Multiple tooltips">
	{#snippet template(args)}
		<div class="wrapper">
			<Tooltip position="top" {...args}>
				{#snippet trigger({ props })}
					<button {...props}>Tooltip 1</button>
				{/snippet}

				{#snippet content()}
					<p>This is the first tooltip!</p>
				{/snippet}
			</Tooltip>

			<Tooltip position="bottom" {...args}>
				{#snippet trigger({ props })}
					<button {...props}>Tooltip 2</button>
				{/snippet}

				{#snippet content()}
					<p>This is the second tooltip!</p>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>

<style>
	.wrapper {
		height: 100svh;
		display: grid;
		place-items: center;
	}
</style>
