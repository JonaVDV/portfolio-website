<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Badge from './Badge.svelte';
	import './Badge.variants.css';
	import CircleCheckIcon from '~icons/lucide/circle-check';
	import TriangleAlertIcon from '~icons/lucide/triangle-alert';
	import CircleXIcon from '~icons/lucide/circle-x';
	import InfoIcon from '~icons/lucide/info';

	const { Story } = defineMeta({
		title: 'Components/Badge',
		component: Badge,
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
		<div class="flex-group">
			<Badge variant="default">Default</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
			<Badge variant="info">Info</Badge>
		</div>
	{/snippet}
</Story>

<Story name="Default" args={{ variant: 'default' }}>
	{#snippet template(args)}
		<Badge {...args}>Default</Badge>
	{/snippet}
</Story>

<Story name="Success" args={{ variant: 'success' }}>
	{#snippet template(args)}
		<Badge {...args}>Success</Badge>
	{/snippet}
</Story>

<Story name="Warning" args={{ variant: 'warning' }}>
	{#snippet template(args)}
		<Badge {...args}>Warning</Badge>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	{#snippet template(args)}
		<Badge {...args}>Error</Badge>
	{/snippet}
</Story>

<Story name="Info" args={{ variant: 'info' }}>
	{#snippet template(args)}
		<Badge {...args}>Info</Badge>
	{/snippet}
</Story>

<!-- ── With icon ──────────────────────────────────────────────────────────── -->

<Story name="With icon">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success"><CircleCheckIcon />Success</Badge>
			<Badge variant="warning"><TriangleAlertIcon />Warning</Badge>
			<Badge variant="error"><CircleXIcon />Error</Badge>
			<Badge variant="info"><InfoIcon />Info</Badge>
		</div>
	{/snippet}
</Story>

<!-- ── Outlined (border color derives from --badge-color automatically) ───────────────────────────────────────────────────────────── -->

<Story name="Outlined">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="default" style="--badge-border-width: 1.5px; --badge-background: transparent;">Default</Badge>
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent;">Success</Badge>
			<Badge variant="warning" style="--badge-border-width: 1.5px; --badge-background: transparent;">Warning</Badge>
			<Badge variant="error" style="--badge-border-width: 1.5px; --badge-background: transparent;">Error</Badge>
			<Badge variant="info" style="--badge-border-width: 1.5px; --badge-background: transparent;">Info</Badge>
		</div>
	{/snippet}
</Story>

<!-- ── Customization layers ──────────────────────────────────────────────── -->

<!-- Layer 1: override the accent color — background and border tint derive automatically -->
<Story name="Customization / Layer 1: custom color">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success">Default green</Badge>
			<Badge variant="success" style="--badge-color: oklch(0.55 0.18 290);">Purple</Badge>
			<Badge variant="success" style="--badge-color: oklch(0.6 0.2 25);">Red-orange</Badge>
		</div>
	{/snippet}
</Story>

<!-- Layer 2: control background tint strength -->
<Story name="Customization / Layer 2: background alpha">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success">Default (15%)</Badge>
			<Badge variant="success" style="--badge-background-alpha: 30%;">Stronger (30%)</Badge>
			<Badge variant="success" style="--badge-background-alpha: 60%;">Heavy (60%)</Badge>
		</div>
	{/snippet}
</Story>

<!-- Layer 2: control border opacity — useful when border-width is set -->
<Story name="Customization / Layer 2: border alpha">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent;">
				Default border (50%)
			</Badge>
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent; --badge-border-alpha: 20%;">
				Subtle border (20%)
			</Badge>
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent; --badge-border-alpha: 100%;">
				Solid border (100%)
			</Badge>
		</div>
	{/snippet}
</Story>

<!-- Layer 3: bypass background derivation with an explicit fill -->
<Story name="Customization / Layer 3: explicit background">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success">Derived tint</Badge>
			<Badge variant="success" style="--badge-background: oklch(0.3 0.15 163); --badge-color: white;">
				Dark filled
			</Badge>
		</div>
	{/snippet}
</Story>

<!-- Layer 3: bypass border color derivation with an explicit color -->
<Story name="Customization / Layer 3: explicit border color">
	{#snippet template()}
		<div class="flex-group">
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent;">
				Derived border
			</Badge>
			<Badge variant="success" style="--badge-border-width: 1.5px; --badge-background: transparent; --badge-border-color: oklch(0.55 0.18 290);">
				Purple border
			</Badge>
		</div>
	{/snippet}
</Story>
