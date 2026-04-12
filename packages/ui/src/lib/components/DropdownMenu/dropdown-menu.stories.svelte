<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import DropdownMenu from './dropdown-menu.svelte';
	const { Story } = defineMeta({
		title: 'Components/Dropdown Menu',
		component: DropdownMenu,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	<DropdownMenu>
		{#snippet trigger({ props })}
			<button {...props} type="button">Open Menu</button>
		{/snippet}

		<button type="button">Profile</button>
		<button type="button">Settings</button>
		<button type="button">Logout</button>
	</DropdownMenu>
</Story>
