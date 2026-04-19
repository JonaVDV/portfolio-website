<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Shell from './Shell.svelte';
	import { Sidebar } from '$components/Sidebar';
	import Header from '$components/Header/header.svelte';
	import DropdownMenu from '$components/DropdownMenu/dropdown-menu.svelte';
	import UpDown from '~icons/lucide/chevrons-up-down';
	import Gallery from '~icons/lucide/gallery-vertical-end';
	import Terminal from '~icons/lucide/square-terminal';
	import Models from '~icons/lucide/bot';
	import Settings from '~icons/lucide/settings-2';
	import Documentation from '~icons/lucide/book-open';
	import DropdownGroup from '$components/DropdownMenu/dropdown-group.svelte';
	import DropdownItem from '$components/DropdownMenu/dropdown-item.svelte';
	import Kbd, { cmd } from '$components/Kbd/Kbd.svelte';
	import Separator from '$components/separator/Separator.svelte';
	import CMD from '~icons/lucide/command';
	import Acme from '~icons/lucide/audio-waveform';

	const { Story } = defineMeta({
		title: 'Components/Shell',
		component: Shell,
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Shell>
			<p style="background-color: crimson;">This is the content of the shell.</p>
			<section class="full-content" style="background: lightblue;">
				<p>This content stretches across the entire width of the shell minus the padding,</p>
			</section>
			<section class="full-start" style="background: orange;">
				<p>This content starts at the very left edge of the shell, ignoring the padding.</p>
			</section>
			<section class="full-end" style="background: blue;">
				<p>This content ends at the very right edge of the shell, ignoring the padding.</p>
			</section>
			<section class="full-content-nopadding" style="background: blueviolet;">
				<p>This content stretches across the entire width of the shell and ignores the padding.</p>
				<p>
					It is essentially the same as full-width. except that full-width includes padding. and
					makes children be in the content column
				</p>
			</section>
			<section class="content-start" style="background: lightgreen;">
				<p>This content starts at the left edge of the content column, ignoring the padding.</p>
			</section>
		</Shell>
	{/snippet}
</Story>

<Story name="With Header">
	{#snippet template()}
		<Shell modules={['header']}>
			{#snippet header()}
				<header class="header | full-width">
					<nav>
						<ul class="flex-group">
							<li><a href="https://example.com/home">Home</a></li>
							<li><a href="https://example.com/about">About</a></li>
							<li><a href="https://example.com/contact">Contact</a></li>
						</ul>
					</nav>
				</header>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>

<Story name="With Sidebar">
	{#snippet template()}
		<Shell modules={['content', 'sidebar']}>
			{#snippet sidebar()}
				<Sidebar.Root>
					<ul>
						<li><a href="https://example.com/home">Home</a></li>
						<li><a href="https://example.com/about">About</a></li>
						<li><a href="https://example.com/contact">Contact</a></li>
					</ul>
				</Sidebar.Root>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>

<Story name="With header and Sidebar">
	{#snippet template()}
		<Shell modules={['header', 'content', 'sidebar']}>
			{#snippet header({ toggleSidebar })}
				<Header sticky layout="full-width">
					<div class="flex-group space-between | full-content">
						<button onclick={toggleSidebar}> sb </button>
						<strong>Portfolio</strong>
					</div>
				</Header>
			{/snippet}
			{#snippet sidebar()}
				<Sidebar.Root>
					{#snippet header()}
						<Sidebar.Header>
							<DropdownMenu
								content="This is the content of the dropdown menu. It can be a string or a Svelte component."
								position="right span-all"
								--popover-padding="8px"
								--icon-size="1em"
							>
								{#snippet trigger({ props })}
									<Sidebar.Item as="button" {...props} class="push-last nowrap">
										<div
											style="background-color: blue; color: white; padding: 0.25rem; aspect-ratio: 1/1; display: grid; place-items: center; border-radius: 0.375rem; width: 1.5rem; flex-shrink: 0;"
										>
											<Gallery width="1.5rem" height="1.5rem" />
										</div>
										<div style="display: grid;">
											<span> Acme Inc </span>
											<span> enterprise </span>
										</div>
										<UpDown />
									</Sidebar.Item>
								{/snippet}
								<DropdownGroup label="Teams">
									<DropdownItem>
										{#snippet before()}
											<Gallery />
										{/snippet}
										Acme Inc
										{#snippet keybind()}
											<Kbd --kbd-background="transparent">{cmd} 1</Kbd>
										{/snippet}
									</DropdownItem>
									<DropdownItem>
										{#snippet before()}
											<Acme />
										{/snippet}
										Acme corp.
										{#snippet keybind()}
											<Kbd --kbd-background="transparent">{cmd} 2</Kbd>
										{/snippet}
									</DropdownItem>
									<DropdownItem>
										{#snippet before()}
											<CMD />
										{/snippet}
										Evil Corp.
										{#snippet keybind()}
											<Kbd --kbd-background="transparent">{cmd} 3</Kbd>
										{/snippet}
									</DropdownItem>
									<Separator></Separator>
									<DropdownItem>Add item</DropdownItem>
								</DropdownGroup>
							</DropdownMenu>
						</Sidebar.Header>
					{/snippet}
					<Sidebar.Group tooltipContent="Playground">
						{#snippet title()}
							<div class="flex-group nowrap">
								<Terminal />
								Playground
							</div>
						{/snippet}
						<Sidebar.Item>History</Sidebar.Item>
						<Sidebar.Item>Starred</Sidebar.Item>
						<Sidebar.Item>Settings</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group tooltipContent="Models">
						{#snippet title()}
							<div class="flex-group nowrap">
								<Models />
								Models
							</div>
						{/snippet}
						<Sidebar.Item>Genisis</Sidebar.Item>
						<Sidebar.Item>Explorer</Sidebar.Item>
						<Sidebar.Item>Quantum</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group tooltipContent="Documentation">
						{#snippet title()}
							<div class="flex-group nowrap">
								<Documentation />
								Documentation
							</div>
						{/snippet}
						<Sidebar.Item>Introduction</Sidebar.Item>
						<Sidebar.Item>Getting Started</Sidebar.Item>
						<Sidebar.Item>Tutorials</Sidebar.Item>
						<Sidebar.Item>Changelog</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group tooltipContent="Settings">
						{#snippet title()}
							<div class="flex-group nowrap">
								<Settings />
								Settings
							</div>
						{/snippet}
						<Sidebar.Item>General</Sidebar.Item>
						<Sidebar.Item>Team</Sidebar.Item>
						<Sidebar.Item>Billing</Sidebar.Item>
						<Sidebar.Item>Limits</Sidebar.Item>
					</Sidebar.Group>
					{#snippet footer()}
						<Sidebar.Footer>
							<div class="flex-group nowrap">
								<Settings />
								Account
							</div>
						</Sidebar.Footer>
					{/snippet}
				</Sidebar.Root>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>
