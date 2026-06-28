<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Skeleton from './Skeleton.svelte';

	const { Story } = defineMeta({
		title: 'Components/Skeleton',
		component: Skeleton,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Skeleton style="--skeleton-width: 16rem;" />
	{/snippet}
</Story>

<!-- Compose primitives into a card placeholder. -->
<Story name="Card placeholder">
	{#snippet template()}
		<div class="flex-group" style="align-items: center;">
			<Skeleton
				style="--skeleton-width: 3rem; --skeleton-height: 3rem; --skeleton-border-radius: var(--radius-circle);"
			/>
			<div class="flow" style="flex: 1;">
				<Skeleton style="--skeleton-width: 60%;" />
				<Skeleton style="--skeleton-width: 90%;" />
			</div>
		</div>
	{/snippet}
</Story>
