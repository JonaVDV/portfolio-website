<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Progress from './Progress.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Progress',
		component: Progress
	});
</script>

<Story name="Default" args={{ value: 50, max: 100 }}></Story>

<Story name="Custom Color">
	{#snippet template()}
		<Progress value={75} max={100} --progress-color="oklch(0.6 0.2 150)"></Progress>
	{/snippet}
</Story>

<Story name="Indeterminate">
	{#snippet template()}
		<Progress --progress-color="oklch(0.6 0.2 150)"></Progress>
	{/snippet}
</Story>

<Story name="Pill Styling">
	{#snippet template()}
		<Progress value={30} max={100} --progress-height="1.5rem" --progress-radius="var(--radius-pill)"
		></Progress>
	{/snippet}
</Story>
