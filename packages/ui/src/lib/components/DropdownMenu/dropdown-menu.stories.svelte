<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import DropdownMenu from './dropdown-menu.svelte';
	import DropdownItem from './dropdown-item.svelte';
	import DropdownGroup from './dropdown-group.svelte';
	import DropdownCheckbox from './dropdown-checkbox.svelte';
	import DropdownRadio from './dropdown-radio.svelte';
	import DropdownSubmenu from './dropdown-submenu.svelte';
	import Kbd, { cmd } from '$components/Kbd/Kbd.svelte';
	import Separator from '$components/Separator/Separator.svelte';
	import Gallery from '~icons/lucide/gallery-vertical-end';
	import CMD from '~icons/lucide/command';
	import Acme from '~icons/lucide/audio-waveform';
	import List from '~icons/lucide/list';
	import Grid from '~icons/lucide/layout-grid';
	import Columns from '~icons/lucide/columns-3';
	import Settings from '~icons/lucide/settings';
	import Trash from '~icons/lucide/trash-2';
	import Share from '~icons/lucide/share';
	import './DropdownMenu.variants.css';

	const { Story } = defineMeta({
		title: 'Components/Dropdown Menu',
		component: DropdownMenu,
		parameters: {
			layout: 'centered',
		},
		argTypes: {
			position: {
				/**
				 * The position of the popover relative to the trigger. See (position-area)[https://developer.mozilla.org/en-US/docs/Web/CSS/position-area] for details.
				*/
				control: { type: 'text' }
			}
		},
		tags: ['autodocs']
	});
</script>

<!-- ─── 1. Plain items (existing baseline) ─────────────────────────────────── -->
<Story name="Items">
	{#snippet template()}
		<DropdownMenu position="right span-bottom" --icon-size="1em">
			{#snippet trigger({ props })}
				<button {...props} type="button">Switch workspace</button>
			{/snippet}
			<DropdownGroup label="">
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
				<Separator layout="full-width" />
				<DropdownItem>Add item</DropdownItem>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>

<!-- ─── 2. Checkbox items ───────────────────────────────────────────────────── -->
<!--
	Each DropdownCheckbox is a self-contained <li> with a visually-hidden native
	<input type="checkbox">. CSS :has(input:checked) on the <li> drives the visual
	indicator — no Svelte state wiring needed unless you want to read the value.

	The separator stretches to the full popover width via `layout="full-width"`,
	while the items sit within the `content` column boundary automatically.
-->
<Story name="Checkboxes">
	{#snippet template()}
		<DropdownMenu position="right span-bottom" --icon-size="1em">
			{#snippet trigger({ props })}
				<button {...props} type="button">View options</button>
			{/snippet}
			<DropdownGroup label="Show">
				<DropdownCheckbox name="show-sidebar">Sidebar</DropdownCheckbox>
				<DropdownCheckbox name="show-toolbar" checked>Toolbar</DropdownCheckbox>
				<DropdownCheckbox name="show-statusbar">Status bar</DropdownCheckbox>
				<Separator layout="full-width" />
				<DropdownCheckbox name="show-minimap">Minimap</DropdownCheckbox>
				<DropdownCheckbox name="show-breadcrumbs" checked>Breadcrumbs</DropdownCheckbox>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>

<!-- ─── 3. Radio items ──────────────────────────────────────────────────────── -->
<!--
	All three radios share name="layout-view", so the browser enforces mutual
	exclusivity natively. No $state needed — the <input> holds checked state in
	the DOM. Listen to onchange on the <ul> if you need to react to changes.
-->
<Story name="Radios">
	{#snippet template()}
		<DropdownMenu position="right span-bottom" --icon-size="1em">
			{#snippet trigger({ props })}
				<button {...props} type="button">Layout</button>
			{/snippet}
			<DropdownGroup label="Layout">
				<DropdownRadio name="layout-view" value="list" checked>
					<List />
					List
				</DropdownRadio>
				<DropdownRadio name="layout-view" value="grid">
					<Grid />
					Grid
				</DropdownRadio>
				<DropdownRadio name="layout-view" value="columns">
					<Columns />
					Columns
				</DropdownRadio>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>

<!-- ─── 4. Submenu ─────────────────────────────────────────────────────────── -->
<!--
	DropdownSubmenu is a <li> containing a Popover. The anchor-scope is scoped
	to the <li> so multiple submenus in the same menu don't interfere. Hover
	opens it; popover="auto" closes it when focus leaves.
-->
<Story name="Submenu">
	{#snippet template()}
		<DropdownMenu position="right span-bottom" --icon-size="1em">
			{#snippet trigger({ props })}
				<button {...props} type="button">File options</button>
			{/snippet}
			<DropdownGroup label="">
				<DropdownItem>
					<Share />
					Share…
				</DropdownItem>
				<DropdownSubmenu label="More actions">
					<DropdownGroup label="">
						<DropdownItem>
							<Settings />
							Properties
						</DropdownItem>
						<Separator layout="full-width" />
						<DropdownItem>
							<Trash />
							Move to trash
						</DropdownItem>
					</DropdownGroup>
				</DropdownSubmenu>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>

<!-- ─── 5. Kitchen sink — all item types together ──────────────────────────── -->
<!--
	Tests that separator full-width breakout, checkbox items, radio items, plain
	items and a nested submenu all compose correctly inside one `.layout` grid.
	All interactive state (checkbox ticks, radio selection) is owned by the native
	<input> elements — no Svelte state wiring needed.
-->
<Story name="Kitchen sink">
	{#snippet template()}
		<DropdownMenu position="right span-bottom" --icon-size="1em">
			{#snippet trigger({ props })}
				<button {...props} type="button">Options</button>
			{/snippet}

			<DropdownGroup label="Workspace">
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
				</DropdownItem>
			</DropdownGroup>

			<Separator layout="full-width" />

			<DropdownGroup label="View">
				<DropdownCheckbox name="ks-sidebar" checked>Sidebar</DropdownCheckbox>
				<DropdownCheckbox name="ks-minimap">Minimap</DropdownCheckbox>

				<Separator layout="full-width" />

				<DropdownRadio name="ks-view" value="list" checked>
					<List />
					List
				</DropdownRadio>
				<DropdownRadio name="ks-view" value="grid">
					<Grid />
					Grid
				</DropdownRadio>
				<DropdownRadio name="ks-view" value="columns">
					<Columns />
					Columns
				</DropdownRadio>
			</DropdownGroup>

			<Separator layout="full-width" />

			<DropdownGroup label="">
				<DropdownSubmenu label="More actions" position="right span-bottom">
					<DropdownGroup label="">
						<DropdownItem>
							<Settings />
							Properties
						</DropdownItem>
						<Separator layout="full-width" />
						<DropdownItem>
							<Trash />
							Move to trash
						</DropdownItem>
					</DropdownGroup>
				</DropdownSubmenu>
			</DropdownGroup>
		</DropdownMenu>
	{/snippet}
</Story>
