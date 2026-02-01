<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		component: Dialog,
		tags: ['autodocs'],
		title: 'Example/Dialog',
		play: async ({ canvas, userEvent }) => {
			await userEvent.click(canvas.getByRole('button'));

			expect(canvas.getByRole('dialog')).toBeVisible();

			await userEvent.click(canvas.getByTestId('close-dialog-button'));

			// await userEvent.click(canvas.get('button', { name: /close/i }));
		}
	});
</script>

<Story name="With js trigger">
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger({ dialogId, openFn, open })}
				<button onclick={openFn}> Open Dialog </button>
			{/snippet}

			<p>Children content here</p>
		</Dialog>
	{/snippet}
</Story>

<Story name="With command api">
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger({ dialogId })}
				<button commandfor={dialogId} command="show-modal"> Open Dialog </button>
			{/snippet}

			<p>Children content here</p>
		</Dialog>
	{/snippet}
</Story>
