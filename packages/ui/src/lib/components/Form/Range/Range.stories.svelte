<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Range from './Range.svelte';

	const { Story } = defineMeta({
		title: 'Components/Form/Range',
		component: Range,
		parameters: {
			layout: 'centered'
		},
		tags: ['autodocs'],
		argTypes: {
			min: { control: { type: 'number' } },
			max: { control: { type: 'number' } },
			step: { control: { type: 'number' } },
			value: { control: { type: 'number' } },
			disabled: { control: { type: 'boolean' } }
		}
	});
</script>

<script>
	// oxlint-disable-next-line import/no-unassigned-import
	import './Range.variants.css';
</script>

<Story name="Default" args={{ min: 0, max: 100, step: 1, value: 50 }}></Story>

<!-- ── States ─────────────────────────────────────────────────────────────── -->

<Story name="States / Disabled" args={{ min: 0, max: 100, step: 1, value: 50, disabled: true }}
></Story>

<!-- :out-of-range fires when value is set programmatically outside min/max bounds.
     The browser clamps the visual thumb position to the track ends, but the CSS
     pseudo-class still applies so the track, thumb and progress use the out-of-range
     color tokens. -->
<Story name="States / Out-of-range">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range min={0} max={100} value={150} />
		</div>
	{/snippet}
</Story>

<!-- ── Customization ──────────────────────────────────────────────────────── -->

<Story name="Customization / Custom progress color">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range min={0} max={100} value={50} style="--range-progress-color: oklch(0.6 0.2 30);" />
		</div>
	{/snippet}
</Story>

<Story name="Customization / Custom colors">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range
				min={0}
				max={100}
				value={50}
				style="
					--range-track-color: oklch(0.3 0.01 260);
					--range-thumb-color: oklch(0.65 0.2 290);
				"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Customization / Custom size">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range
				min={0}
				max={100}
				value={50}
				style="
					--range-track-height: 0.625rem;
					--range-thumb-size: 1.5rem;
					--range-track-radius: 4px;
				"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Customization / Custom focus ring">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range
				min={0}
				max={100}
				value={50}
				style="
					--range-focus-color: oklch(0.65 0.2 30);
					--range-focus-width: 4px;
				"
			/>
		</div>
	{/snippet}
</Story>

<!-- :out-of-range customization — override the default red with teal -->
<Story name="Customization / Custom validation colors">
	{#snippet template()}
		<div style="padding: 2rem;">
			<Range
				min={0}
				max={100}
				value={150}
				style="
					--range-out-of-range-color: oklch(0.6 0.18 200);
					--range-out-of-range-thumb-color: oklch(0.6 0.18 200);
					--range-out-of-range-progress-color: oklch(0.6 0.18 200);
				"
			/>
		</div>
	{/snippet}
</Story>
