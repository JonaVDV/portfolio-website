<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Shell from './Shell.svelte';
	import Sidebar from '$components/Sidebar/Sidebar.svelte';

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
							<li><a href="#">Home</a></li>
							<li><a href="#">About</a></li>
							<li><a href="#">Contact</a></li>
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
				<Sidebar>
					<ul>
						<li><a href="#">Home</a></li>
						<li><a href="#">About</a></li>
						<li><a href="#">Contact</a></li>
					</ul>
				</Sidebar>
			{/snippet}
			<p>This is the content of the shell.</p>
		</Shell>
	{/snippet}
</Story>
