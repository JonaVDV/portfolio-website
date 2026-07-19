<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Tabs from './Tabs.svelte';
	import TabList from './TabList.svelte';
	import TabTrigger from './TabTrigger.svelte';
	import TabPanel from './TabPanel.svelte';

	const { Story } = defineMeta({
		title: 'Components/Tabs',
		component: Tabs
	});
</script>

<Story name="Default">
	{#snippet template()}
		<div class="primary-layout">
			<div class="card">
				<Tabs value="overflow">
					<TabList>
						<TabTrigger tab="account">Tab 1</TabTrigger>
						<TabTrigger tab="settings">Tab 2</TabTrigger>
						<TabTrigger tab="profile">Tab 3</TabTrigger>
						<TabTrigger tab="disabled" disabled>Disabled Tab</TabTrigger>
						<TabTrigger tab="long">This is a very long tab that should be truncated</TabTrigger>
						<TabTrigger tab="overflow"
							>This is a very long tab that should cause overflow and be scrollable</TabTrigger
						>
						<TabTrigger tab="overflow2"
							>This is a very long tab that should cause overflow and be scrollable</TabTrigger
						>
					</TabList>
					<TabPanel tab="account">
						<p>This is the content of Tab 1.</p>
					</TabPanel>
					<TabPanel tab="settings">
						<p>This is the content of Tab 2.</p>
					</TabPanel>
					<TabPanel tab="profile">
						<p>This is the content of Tab 3.</p>
					</TabPanel>
					<TabPanel tab="disabled">
						<p>This is the content of the disabled tab.</p>
					</TabPanel>
					<TabPanel tab="long">
						<p>This is the content of the long tab.</p>
					</TabPanel>
					<TabPanel tab="overflow">
						<p>This is the content of the overflow tab.</p>
					</TabPanel>
					<TabPanel tab="overflow2">
						<p>This is the content of the overflow tab 2.</p>
					</TabPanel>
				</Tabs>
			</div>
		</div>
	{/snippet}
</Story>

<!-- some basic card styling -->
<style>
	.card {
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		background-color: #fff;
	}
</style>
