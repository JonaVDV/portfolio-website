<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './Checkbox.svelte';
	import './Checkbox.variants.css';

	const { Story } = defineMeta({
		component: Checkbox,
		parameters: {
			layout: 'centered'
		},
		tags: ['autodocs'],
		args: {
			indeterminate: false
		},
		argTypes: {
			indeterminate: {
				control: { type: 'boolean' },
				description: 'Whether the checkbox is in an indeterminate state.',
				table: {
					type: { summary: 'boolean' },
					defaultValue: { summary: '' }
				}
			}
		},
		title: 'Components/Form/Checkbox'
	});
</script>

<!-- Default check mark, snaps in on check. -->
<Story name="Default">
	<Checkbox />
</Story>

<!-- Any snippet works as the checked icon. -->
<Story name="Custom icon">
	{#snippet template(args)}
		<Checkbox {...args}>
			{#snippet checkmark()}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17l-6.2 3.6 1.6-6.7L2.2 8.9l6.9-.6z" />
				</svg>
			{/snippet}
		</Checkbox>
	{/snippet}
</Story>

<!-- Indeterminate (e.g. a table's "select all" header). Needs JS to set the flag. -->
<Story name="Indeterminate"></Story>

<!-- Swap either default icon with a url() — no snippet needed. -->
<Story name="Custom url() icons">
	{#snippet template(args)}
		<div class="custom-url">
			<Checkbox {...args} />
		</div>
	{/snippet}
</Story>

<!--
	Animation is opt-in: setting --checkbox-transition makes the registered
	--checkbox-checked number interpolate 0 -> 1. The check is "drawn" by reading
	that value into stroke-dashoffset. No JS, no Svelte transition — pure CSS.
-->
<Story name="Animated (draw)">
	{#snippet template(args)}
		<div class="animated">
			<Checkbox {...args}>
				{#snippet checkmark()}
					<svg
						class="draw"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				{/snippet}
			</Checkbox>
		</div>
	{/snippet}
</Story>

<style>
	.animated {
		--checkbox-transition: 0.25s;
		--checkbox-transition: 1s;
		--checkbox-checkmark-color: var(--clr-surface-100, #fff);
	}
	.draw path {
		/* offset hides the stroke when unchecked, reveals it as --checkbox-checked -> 1 */
		stroke-dasharray: 50;
		stroke-dashoffset: calc((1 - var(--checkbox-checked)) * 50);
	}
	.custom-url {
		/* a plus and a minus, both as masks — colour still comes from --checkbox-checkmark-color */
		--checkbox-checkmark-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M11 5h2v14h-2zM5 11h14v2H5z'/%3E%3C/svg%3E");
		--checkbox-indeterminate-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3C/svg%3E");
	}
</style>
