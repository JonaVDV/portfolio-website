<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import DropdownMenu from './dropdown-menu.svelte';
	import DropdownItem from './dropdown-item.svelte';
	import Kbd, { cmd } from '$components/Kbd/Kbd.svelte';
	import Separator from '$components/separator/Separator.svelte';
	import DropdownGroup from './dropdown-group.svelte';
	import Gallery from '~icons/lucide/gallery-vertical-end';
	import CMD from '~icons/lucide/command';
	import Acme from '~icons/lucide/audio-waveform';
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
			position="right top"
			inheritTriggerWidth={true}
			--popover-padding="8px"
			--icon-size="1em"
		>
			{#snippet trigger({ props })}
				<button {...props} type="button">Open Dropdown</button>
			{/snippet}
			<DropdownGroup label="Teams">
				<DropdownItem>
					<Gallery />
					Acme Inc
					{#snippet keybind()}
						<Kbd --kbd-background="transparent">{cmd} 1</Kbd>
					{/snippet}
				</DropdownItem>
				<DropdownItem>
					<Acme />
					Acme corp.
					{#snippet keybind()}
						<Kbd --kbd-background="transparent">{cmd} 2</Kbd>
					{/snippet}
				</DropdownItem>
				<DropdownItem>
					<CMD />
					Evil Corp.
					{#snippet keybind()}
						<Kbd --kbd-background="transparent">{cmd} 3</Kbd>
					{/snippet}
				</DropdownItem>
				<Separator></Separator>
				<DropdownItem>Add item</DropdownItem>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>
