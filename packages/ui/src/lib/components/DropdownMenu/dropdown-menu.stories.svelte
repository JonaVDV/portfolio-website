<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import DropdownMenu from './dropdown-menu.svelte';
	import DropdownItem from './dropdown-item.svelte';
	import Kbd, { cmd } from '$components/Kbd/Kbd.svelte';
	import Separator from '$components/separator/Separator.svelte';
	const { Story } = defineMeta({
		title: 'Components/Dropdown Menu',
		component: DropdownMenu,
		argTypes: {
			position: {
				control: {
					type: 'select'
				}
			}
		},
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<DropdownMenu
			content="This is the content of the dropdown menu. It can be a string or a Svelte component."
			position="right span-all"
			--popover-padding="8px"
			--icon-size="1em"
		>
			{#snippet trigger({ props })}
				<button {...props} type="button">Open Dropdown</button>
			{/snippet}
			<DropdownItem>
				{#snippet before()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=""
						><!----><path d="M7 2h10"></path><!----><path d="M5 6h14"></path><!----><rect
							width="18"
							height="12"
							x="3"
							y="10"
							rx="2"
						></rect></svg
					>
				{/snippet}
				Acme Inc
				{#snippet keybind()}
					<Kbd --kbd-background="transparent">{cmd} 1</Kbd>
				{/snippet}
			</DropdownItem>
			<DropdownItem>
				{#snippet before()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=""
						><path
							d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
						></path></svg
					>
				{/snippet}
				Acme corp.
				{#snippet keybind()}
					<Kbd --kbd-background="transparent">{cmd} 2</Kbd>
				{/snippet}
			</DropdownItem>
			<DropdownItem>
				{#snippet before()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class=""
						><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
						></path></svg
					>
				{/snippet}
				Evil Corp.
				{#snippet keybind()}
					<Kbd --kbd-background="transparent">{cmd} 3</Kbd>
				{/snippet}
			</DropdownItem>
			<Separator></Separator>
			<DropdownItem>
				Add item
			</DropdownItem>
		</DropdownMenu>
	{/snippet}
</Story>
