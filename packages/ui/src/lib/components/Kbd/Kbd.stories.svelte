<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import Kbd, { cmd, ctrl, alt, shift } from './Kbd.svelte';
	const { Story } = defineMeta({
		title: 'Components/Kbd',
		component: Kbd,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<!-- cmd icon + k -->
	{cmd} + k
</Story>

<Story name="Custom Content">
	<!-- ctrl + alt + delete -->
	{ctrl} + {alt} + delete
</Story>

<Story name="Multiple Keys">
	{#snippet template()}
		<Kbd>
			{shift}
		</Kbd>
		+
		<Kbd>
			{cmd}
		</Kbd>
		+
		<Kbd>
			{alt}
		</Kbd>
	{/snippet}
</Story>
