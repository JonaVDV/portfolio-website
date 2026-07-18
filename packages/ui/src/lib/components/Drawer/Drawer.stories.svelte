<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Drawer from './Drawer.svelte';
	import { Button } from '$components/Button';
	import { Heading } from '$components/Heading';
	import { Text } from '$components/Text';

	const { Story } = defineMeta({
		title: 'Components/Drawer',
		component: Drawer
	});
</script>

<!-- Grab the handle and drag towards the edge (or flick) to dismiss. -->
<Story name="Default">
	{#snippet template()}
		<Drawer side="bottom">
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">Open Drawer</Button>
			{/snippet}

			{#snippet header()}
				<div class="layout">
					<Heading level="h2">Drag me down</Heading>
					<Text variant="muted">Pull the handle towards the edge, or flick, to dismiss.</Text>
				</div>
			{/snippet}

			<div class="layout">
				<Text>
					A drawer is a bottom Sheet with a grab handle and pointer drag-to-dismiss. Everything else
					— backdrop, close button, focus trapping — comes from Dialog.
				</Text>
			</div>
		</Drawer>
	{/snippet}
</Story>
