<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Shell from './Shell.svelte';
	import { Sidebar } from '$components/Sidebar';
	import Header from '$components/Header/header.svelte';

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
					<div class="flex-group space-between">
						<button onclick={toggleSidebar}> sb </button>
						<strong>Portfolio</strong>
					</div>
				</Header>
			{/snippet}
			{#snippet sidebar()}
				<Sidebar.Root>
					{#snippet header()}
						<div class="sidebar-header | flex-group space-between">
							<strong>Menu</strong>
						</div>
					{/snippet}
					<Sidebar.Group collapsible={false}>
						{#snippet title()}
							<div class="flex-group nowrap">
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
									class="lucide-icon lucide lucide-square-terminal"
									><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect
										width="18"
										height="18"
										x="3"
										y="3"
										rx="2"
										ry="2"
									></rect></svg
								>
								Playground
							</div>
						{/snippet}
						<Sidebar.Item>History</Sidebar.Item>
						<Sidebar.Item>Starred</Sidebar.Item>
						<Sidebar.Item>Settings</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group>
						{#snippet title()}
							<div class="flex-group nowrap">
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
									class="lucide-icon lucide lucide-square-terminal"
									><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect
										width="18"
										height="18"
										x="3"
										y="3"
										rx="2"
										ry="2"
									></rect></svg
								>
								Playground
							</div>
						{/snippet}
						<Sidebar.Item>History</Sidebar.Item>
						<Sidebar.Item>Starred</Sidebar.Item>
						<Sidebar.Item>Settings</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group>
						{#snippet title()}
							<div class="flex-group nowrap">
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
									class="lucide-icon lucide lucide-square-terminal"
									><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect
										width="18"
										height="18"
										x="3"
										y="3"
										rx="2"
										ry="2"
									></rect></svg
								>
								Playground
							</div>
						{/snippet}
						<Sidebar.Item>History</Sidebar.Item>
						<Sidebar.Item>Starred</Sidebar.Item>
						<Sidebar.Item>Settings</Sidebar.Item>
					</Sidebar.Group>
					<Sidebar.Group>
						{#snippet title()}
							<div class="flex-group nowrap">
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
									class="lucide-icon lucide lucide-square-terminal"
									><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect
										width="18"
										height="18"
										x="3"
										y="3"
										rx="2"
										ry="2"
									></rect></svg
								>
								Playground
							</div>
						{/snippet}
						<Sidebar.Item>History</Sidebar.Item>
						<Sidebar.Item>Starred</Sidebar.Item>
						<Sidebar.Item>Settings</Sidebar.Item>
					</Sidebar.Group>
				</Sidebar.Root>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>
