<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Sidebar } from './index';
	import SidebarGroup from './SidebarGroup.svelte';
	import SidebarItem from './SidebarItem.svelte';
	import DropdownMenu from '$components/DropdownMenu/dropdown-menu.svelte';
	import Separator from '$components/separator/Separator.svelte';
	import Button from '$components/Button/Button.svelte';
	import { Root } from './exports';
	const { Story } = defineMeta({
		title: 'Components/Sidebar',
		component: Root,
		tags: ['autodocs']
	});
</script>

<Story name="Default Sidebar">
	<Sidebar.Root>
		{#snippet header()}
			<div class="flex-group space-between nowrap">
				<div>
					<strong>Acme Inc.</strong>
					<p>Enterprise workspace</p>
				</div>

				<DropdownMenu>
					{#snippet trigger({ props })}
						<Button {...props} variant="stripped">Workspace</Button>
					{/snippet}

					<button type="button">Settings</button>
					<button type="button">Members</button>
					<Separator />
					<button type="button">Switch account</button>
				</DropdownMenu>
			</div>
		{/snippet}

		<SidebarGroup title="Platform">
			<SidebarItem href="https://example.com/playground" active>Playground</SidebarItem>
			<SidebarItem href="https://example.com/history">History</SidebarItem>
			<SidebarItem href="https://example.com/starred">Starred</SidebarItem>
			<SidebarItem href="https://example.com/settings">Settings</SidebarItem>
		</SidebarGroup>

		<SidebarGroup title="Projects">
			<SidebarItem href="https://example.com/design">Design Engineering</SidebarItem>
			<SidebarItem href="https://example.com/sales">Sales &amp; Marketing</SidebarItem>
			<SidebarItem href="https://example.com/travel">Travel</SidebarItem>
		</SidebarGroup>

		{#snippet footer()}
			<div class="flex-group nowrap">
				<div>
					<strong>shadcn</strong>
					<p>m@example.com</p>
				</div>
			</div>
		{/snippet}
	</Sidebar.Root>
</Story>

<Story name="Composable Sidebar">
	{#snippet template()}
		<Sidebar.Root>
			<section class="flex-group">
				<div>
					<strong>Workspace</strong>
					<p>Project navigation</p>
				</div>
			</section>

			<SidebarGroup title="Main">
				<SidebarItem href="https://example.com/overview" active>Overview</SidebarItem>
				<SidebarItem href="https://example.com/pages">Pages</SidebarItem>
				<SidebarItem href="https://example.com/assets">Assets</SidebarItem>
			</SidebarGroup>

			<SidebarGroup title="Navigation" open>
				<SidebarItem href="https://example.com/dashboard">Dashboard</SidebarItem>
				<SidebarItem href="https://example.com/settings">Settings</SidebarItem>
				<SidebarItem href="https://example.com/integrations">Integrations</SidebarItem>
			</SidebarGroup>

			<section class="flex-group">
				<SidebarItem href="https://example.com/logout">Sign out</SidebarItem>
			</section>
		</Sidebar.Root>
	{/snippet}
</Story>
