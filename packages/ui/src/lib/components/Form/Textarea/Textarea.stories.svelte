<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Textarea from './Textarea.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			placeholder: { control: 'text' },
			disabled: { control: 'boolean' },
			rows: { control: 'number' }
		}
	});
</script>

<script>
	// oxlint-disable-next-line import/no-unassigned-import
	import './Textarea.variants.css';
</script>

<Story name="Default">
	{#snippet template()}
		<Textarea placeholder="Type something..." />
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Textarea placeholder="Disabled" disabled />
	{/snippet}
</Story>

<!-- ── States ─────────────────────────────────────────────────────────────── -->

<Story name="States / Invalid">
	{#snippet template()}
		<Textarea value="bad content" aria-invalid="true" />
	{/snippet}
</Story>

<!-- :user-valid fires only after the user has interacted with the field — type something and blur -->
<Story name="States / Valid">
	{#snippet template()}
		<Textarea placeholder="Type something and blur" required />
	{/snippet}
</Story>

<!-- ── Customization ──────────────────────────────────────────────────────── -->

<Story name="Customization / Custom background">
	{#snippet template()}
		<Textarea
			placeholder="Dark surface"
			style="
				--textarea-background: oklch(0.2 0.01 260);
				--textarea-text-color: oklch(0.95 0 0);
				--textarea-border-color: oklch(0.35 0.01 260);
			"
		/>
	{/snippet}
</Story>

<Story name="Customization / Resize disabled">
	{#snippet template()}
		<Textarea placeholder="Cannot be resized" style="--textarea-resize: none;" />
	{/snippet}
</Story>
