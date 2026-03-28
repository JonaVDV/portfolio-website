<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import Sidebar from './Sidebar.svelte';
	import Submenu from './Submenu.svelte';
	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		component: Sidebar,
		tags: ['autodocs']
	});
</script>

<Story name="Default Sidebar">
	<Submenu title="Menu 1">
		<p>Submenu content for Menu 1</p>
	</Submenu>
</Story>
