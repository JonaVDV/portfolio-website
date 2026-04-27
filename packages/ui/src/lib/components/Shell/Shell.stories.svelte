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
	import Travel from '~icons/lucide/map';
	import CircleChart from '~icons/lucide/pie-chart';
	import Frame from '~icons/lucide/frame';
	import Kebab from '~icons/lucide/ellipsis';
	import Button from '$components/Button/Button.svelte';

	const { Story } = defineMeta({
		title: 'Components/Shell',
		component: Shell,
		tags: ['autodocs']
	});
</script>

{#snippet sidebar_item_action()}
	<DropdownMenu position="center right" --popover-trigger-width="fit-content" --popover-custom-fallbacks="none">
		{#snippet trigger({ props })}
			<Button {...props}>
				<Kebab />
			</Button>
		{/snippet}
		<DropdownItem>Sub Action 1</DropdownItem>
		<DropdownItem>Sub Action 2</DropdownItem>
		<DropdownItem>Sub Action 3</DropdownItem>
	</DropdownMenu>
{/snippet}

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
						<Button variant="stripped" onclick={toggleSidebar}> sb </Button>
						<strong>Portfolio</strong>
					</div>
				</Header>
			{/snippet}
			{#snippet sidebar()}
				<Sidebar.Root --sidebar-item-font-size="0.875rem">
					{#snippet header()}
						<Sidebar.Header>
							<DropdownMenu
								content="This is the content of the dropdown menu. It can be a string or a Svelte component."
								position="right top"
								inheritTriggerWidth
								--popover-padding="8px"
								--icon-size="1em"
							>
								{#snippet trigger({ props })}
									<Sidebar.Item as="button" {...props} class="push-last nowrap">
										<div class="company-logo">
											<Gallery />
										</div>
										<div style="display: grid;">
											<span class="truncate"> Acme Inc </span>
											<span class="truncate"> enterprise </span>
										</div>
										<UpDown />
									</Sidebar.Item>
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
						</Sidebar.Header>
					{/snippet}
					<Sidebar.Section label="Platform">
						<Sidebar.Group tooltipContent="Playground">
							{#snippet title()}
								<Terminal />
								Playground
							{/snippet}
							<Sidebar.Item href="#">History</Sidebar.Item>
							<Sidebar.Item href="#">Starred</Sidebar.Item>
							<Sidebar.Item href="#">Settings</Sidebar.Item>
						</Sidebar.Group>
						<Sidebar.Group tooltipContent="Models">
							{#snippet title()}
								<Models />
								Models
							{/snippet}
							<Sidebar.Item href="#">Genisis</Sidebar.Item>
							<Sidebar.Item href="#">Explorer</Sidebar.Item>
							<Sidebar.Item href="#">Quantum</Sidebar.Item>
						</Sidebar.Group>
						<Sidebar.Group tooltipContent="Documentation">
							{#snippet title()}
								<Documentation />
								Documentation
							{/snippet}
							<Sidebar.Item href="#">Introduction</Sidebar.Item>
							<Sidebar.Item href="#">Getting Started</Sidebar.Item>
							<Sidebar.Item href="#">Tutorials</Sidebar.Item>
							<Sidebar.Item href="#">Changelog</Sidebar.Item>
						</Sidebar.Group>
						<Separator --separator-margin=".125rem" />
						<Sidebar.Group tooltipContent="Settings">
							{#snippet title()}
								<Settings />
								Settings
							{/snippet}
							<Sidebar.Item href="#">General</Sidebar.Item>
							<Sidebar.Item href="#">Team</Sidebar.Item>
							<Sidebar.Item href="#">Billing</Sidebar.Item>
							<Sidebar.Item href="#">Limits</Sidebar.Item>
						</Sidebar.Group>
					</Sidebar.Section>
					<Sidebar.Section label="Projects" --sidebar-item-font-size="0.875rem">
						<Sidebar.Item class="" href="#" action={sidebar_item_action}>
							<Frame />
							Design engineering
						</Sidebar.Item>
						<Sidebar.Item class="" href="#" action={sidebar_item_action}>
							<CircleChart />
							Sales and marketing
						</Sidebar.Item>
						<Sidebar.Item class="" href="#" action={sidebar_item_action}>
							<Travel />
							Travel
						</Sidebar.Item>
					</Sidebar.Section>
					{#snippet footer()}
						<Sidebar.Footer>
							<Sidebar.Item as="button">
								<img src="https://www.shadcn-svelte.com/avatars/shadcn.jpg" alt="" />
								<div class="account-details text-start">
									<span class="fw-bold | truncate">shadcn</span>
									<span class="truncate">shadcn@example.com</span>
								</div>
								<UpDown />
							</Sidebar.Item>
						</Sidebar.Footer>
					{/snippet}
				</Sidebar.Root>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>

<style>
	img {
		border-radius: 50%;
		aspect-ratio: 1/1;
		max-width: min(3rem, 100%);
	}

	.text-start {
		text-align: start;
	}

	.company-logo {
		max-width: min(2.5rem, 100%);
		width: 100%;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		background-color: blue;
		color: white;
		border-radius: 50%;
	}

	.account-details {
		display: grid;
		/* overflow: hidden; */
	}

	.truncate {
		overflow: hidden;
		text-overflow: clip;
		white-space: nowrap;
	}

	.account-details span:last-child {
		font-size: 0.75rem;
	}
</style>
