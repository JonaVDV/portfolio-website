<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Alert from './Alert.svelte';
	import './Alert.variants.css';
	import CircleCheckIcon from '~icons/lucide/circle-check';
	import TriangleAlertIcon from '~icons/lucide/triangle-alert';
	import CircleXIcon from '~icons/lucide/circle-x';
	import InfoIcon from '~icons/lucide/info';

	const { Story } = defineMeta({
		title: 'Components/Alert',
		component: Alert,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: { type: 'select' },
				options: ['default', 'success', 'warning', 'error', 'info']
			}
		}
	});
</script>

<!-- ── Variants ─────────────────────────────────────────────────────────── -->

<Story name="All variants">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 1rem;">
			<Alert variant="default">
				<InfoIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Default alert</strong>
					<p>This is a default alert message with general information.</p>
				</div>
			</Alert>
			<Alert variant="success">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Success</strong>
					<p>Your changes have been saved successfully.</p>
				</div>
			</Alert>
			<Alert variant="warning">
				<TriangleAlertIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Warning</strong>
					<p>This action may have unintended consequences. Proceed with caution.</p>
				</div>
			</Alert>
			<Alert variant="error">
				<CircleXIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Error</strong>
					<p>Something went wrong. Please try again or contact support.</p>
				</div>
			</Alert>
			<Alert variant="info">
				<InfoIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Info</strong>
					<p>Here is some helpful information you might want to know.</p>
				</div>
			</Alert>
		</div>
	{/snippet}
</Story>

<Story name="Default" args={{ variant: 'default' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<InfoIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Default alert</strong>
				<p>This is a default alert message with general information.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Success</strong>
				<p>Your changes have been saved successfully.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<TriangleAlertIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Warning</strong>
				<p>This action may have unintended consequences. Proceed with caution.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<CircleXIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Error</strong>
				<p>Something went wrong. Please try again or contact support.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<Story name="Info" args={{ variant: 'info' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<InfoIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Info</strong>
				<p>Here is some helpful information you might want to know.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<!-- ── Title only ─────────────────────────────────────────────────────────── -->

<Story name="Title only" args={{ variant: 'info' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<InfoIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Alert Title</strong>
			</div>
		</Alert>
	{/snippet}
</Story>

<!-- ── With actions ───────────────────────────────────────────────────────── -->

<Story name="With actions" args={{ variant: 'warning' }}>
	{#snippet template(args)}
		<Alert {...args}>
			<TriangleAlertIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Are you sure?</strong>
				<p>This action may have unintended consequences. Proceed with caution.</p>
			</div>
			{#snippet actions()}
				<button>Confirm</button>
				<button>Dismiss</button>
			{/snippet}
		</Alert>
	{/snippet}
</Story>

<!-- ── Max width ──────────────────────────────────────────────────────────── -->

<Story name="Max width" args={{ variant: 'default' }}>
	{#snippet template(args)}
		<Alert {...args} --alert-max-width="480px">
			<InfoIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Default alert</strong>
				<p>This alert is capped at 480px wide using the --alert-max-width custom property.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<!-- ── Customization layers ──────────────────────────────────────────────── -->

<!-- Layer 1: override the base background — text color and border derive automatically via oklch -->
<Story name="Customization / Layer 1: custom background">
	{#snippet template()}
		<Alert variant="success" style="--alert-background: oklch(0.92 0.08 290);">
			<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Custom background</strong>
				<p>Text color and border are derived automatically from the purple background.</p>
			</div>
		</Alert>
	{/snippet}
</Story>

<!-- Layer 2: tune lightness of derived text and border colors -->
<Story name="Customization / Layer 2: lightness">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 1rem;">
			<Alert variant="success">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Defaults: text 5%, border 80%</strong>
					<p>Dark near-black text, medium-lightness border derived from background.</p>
				</div>
			</Alert>
			<Alert variant="success" style="--alert-color-l: 30%; --alert-border-l: 50%;">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Text 30%, border 50%</strong>
					<p>Both lightness values lowered — text is visibly lighter, border noticeably darker.</p>
				</div>
			</Alert>
		</div>
	{/snippet}
</Story>

<!-- Layer 2: shift chroma to desaturate or intensify derived border color -->
<Story name="Customization / Layer 2: chroma">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 1rem;">
			<Alert variant="success">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Default chroma (no shift)</strong>
					<p>Border chroma inherits from the background color.</p>
				</div>
			</Alert>
			<Alert variant="success" style="--alert-border-c: -0.05;">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Desaturated border (c − 0.05)</strong>
					<p>Border chroma nudged down — border becomes more neutral/gray.</p>
				</div>
			</Alert>
			<Alert variant="success" style="--alert-border-c: 0.1;">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Vivid border (c + 0.1)</strong>
					<p>Border chroma nudged up — border becomes more intensely green.</p>
				</div>
			</Alert>
		</div>
	{/snippet}
</Story>

<!-- Layer 2: rotate hue of derived colors relative to the background -->
<Story name="Customization / Layer 2: hue">
	{#snippet template()}
		<div style="display: flex; flex-direction: column; gap: 1rem; --alert-border-width: 10px;">
			<Alert variant="success">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Default hue (no shift)</strong>
					<p>Border hue inherits from the background (green).</p>
				</div>
			</Alert>
			<Alert variant="success" style="--alert-border-h: 60;">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Border hue +60°</strong>
					<p>Border rotated 60° into cyan-green territory.</p>
				</div>
			</Alert>
			<Alert variant="success" style="--alert-border-h: 120;">
				<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
				<div>
					<strong>Border hue +120°</strong>
					<p>Border rotated 120° — now in lilac territory.</p>
				</div>
			</Alert>
		</div>
	{/snippet}
</Story>

<!-- Layer 3: bypass derivation entirely with explicit color and border overrides -->
<Story name="Customization / Layer 3: explicit color">
	{#snippet template()}
		<Alert
			variant="success"
			style="--alert-color: oklch(0.3 0.15 163); --alert-border-color: oklch(0.5 0.15 163);"
		>
			<CircleCheckIcon style="flex-shrink: 0; align-self: start;" />
			<div>
				<strong>Explicit overrides</strong>
				<p>Text color and border color are set directly, bypassing oklch derivation.</p>
			</div>
		</Alert>
	{/snippet}
</Story>
