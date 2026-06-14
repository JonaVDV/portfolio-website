<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';
	import Button from '$components/Button/Button.svelte';

	const { Story } = defineMeta({
		component: Dialog,
		tags: ['autodocs'],
		title: 'Components/Dialog'
	});
</script>

<Story name="With Spread Props">
	{#snippet template(args)}
		<Dialog {...args} closeButton>
			{#snippet trigger({ triggerProps })}
				<button {...triggerProps}>Open Dialog</button>
			{/snippet}

			<p>This dialog uses native Invoker Commands API with progressive enhancement.</p>
			<p>Supported in: Chrome 135+, Firefox 144+, Safari 26.2+, Edge 135+</p>
			<p>
				The <code>triggerProps</code> include both command API support and fallback
				<code>onclick</code> handler.
			</p>
		</Dialog>
	{/snippet}
</Story>

<Story name="With Button Component">
	{#snippet template(args)}
		<Dialog {...args} closeButton>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="outline">Open Dialog</Button>
			{/snippet}

			<p>This example shows how to use triggerProps with custom Button components.</p>
		</Dialog>
	{/snippet}
</Story>

<Story name="Full Layout with Header and Footer">
	{#snippet template(args)}
		<Dialog {...args} closeButton>
			{#snippet trigger({ triggerProps })}
				<button {...triggerProps}>Open Full Dialog</button>
			{/snippet}

			{#snippet header()}
				<h2>Edit Profile</h2>
				<p style="font-size: 0.875rem; color: gray; margin: 0.25rem 0 0;">
					Make changes to your profile here. Click save when you're done.
				</p>
			{/snippet}

			<div class="flow" style="--flow-spacer: 1rem; padding: 1rem 0;">
				<div class="" style="display: grid; gap: 0.5rem;">
					<label for="name">Name</label>
					<input id="name" value="Pedro Duarte" />
				</div>
				<div class="" style="display: grid; gap: 0.5rem;">
					<label for="username">Username</label>
					<input id="username" value="@peduarte" />
				</div>
			</div>

			{#snippet footer()}
				<div class="flex-group push-first">
					<form method="dialog">
						<Button variant="outline">Cancel</Button>
					</form>
					<Button onclick={() => alert('Saved!')}>Save Changes</Button>
				</div>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>
