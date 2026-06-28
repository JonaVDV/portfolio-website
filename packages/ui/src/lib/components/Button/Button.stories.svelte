<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './index';
	import { fn } from 'storybook/test';
	import ButtonGroup from '../ButtonGroup/ButtonGroup.svelte';
	import PlusIcon from '~icons/lucide/plus';

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			style: { control: 'object' },
			variant: {
				control: { type: 'select' },
				options: ['stripped', 'primary', 'secondary', 'ghost', 'outline', 'destructive']
			},
			size: {
				control: { type: 'select' },
				options: ['small', 'large', 'icon']
			},
			as: {
				control: { type: 'inline-radio' }
			},
			disabled: { control: 'boolean' },
			children: { control: 'text' }
		},
		args: {
			onclick: fn(),
			style: {}
		}
	});
</script>

<script>
	// oxlint-disable-next-line import/no-unassigned-import
	import './Button.variants.css';
</script>

<!-- ── Variants ─────────────────────────────────────────────────────────── -->

<Story name="Stripped" args={{ variant: 'stripped' }}>Stripped</Story>

<Story name="Primary" args={{ variant: 'primary' }}>Primary</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Secondary</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Ghost</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Outline</Story>

<Story name="Destructive" args={{ variant: 'destructive' }}>Destructive</Story>

<!-- ── Disabled ───────────────────────────────────────────────────────────── -->

<Story name="Disabled">
	{#snippet template()}
		<ButtonGroup>
			<Button variant="primary" disabled>Primary</Button>
			<Button variant="secondary" disabled>Secondary</Button>
			<Button variant="ghost" disabled>Ghost</Button>
			<Button variant="outline" disabled>Outline</Button>
			<Button variant="destructive" disabled>Destructive</Button>
		</ButtonGroup>
	{/snippet}
</Story>

<!-- ── Sizes ──────────────────────────────────────────────────────────────── -->

<Story name="Sizes">
	{#snippet template()}
		<ButtonGroup>
			<Button variant="primary" size="small">Small</Button>
			<Button variant="primary">Default</Button>
			<Button variant="primary" size="large">Large</Button>
		</ButtonGroup>
	{/snippet}
</Story>

<!-- Icon size: square button, place a single icon inside -->
<Story name="Sizes / Icon">
	{#snippet template()}
		<ButtonGroup>
			<Button variant="primary" size="icon"><PlusIcon width="16" height="16" /></Button>
			<Button variant="secondary" size="icon"><PlusIcon width="16" height="16" /></Button>
			<Button variant="ghost" size="icon"><PlusIcon width="16" height="16" /></Button>
			<Button variant="outline" size="icon"><PlusIcon width="16" height="16" /></Button>
			<Button variant="destructive" size="icon"><PlusIcon width="16" height="16" /></Button>
		</ButtonGroup>
	{/snippet}
</Story>

<!-- ── Customization layers ──────────────────────────────────────────────── -->

<!-- Layer 1: override the base color — hover/active shift automatically via oklch -->
<Story name="Customization / Layer 1: custom base color">
	{#snippet template()}
		<Button variant="primary" style="--button-background: oklch(0.55 0.18 140);">Green base</Button>
	{/snippet}
</Story>

<!-- Layer 2: tune the oklch lightness delta for hover and active -->
<Story name="Customization / Layer 2: subtle hover shift">
	{#snippet template()}
		<Button variant="primary" style="--button-hover-l: -0.04; --button-active-l: -0.08;">
			Subtle shift
		</Button>
	{/snippet}
</Story>

<!-- Layer 2: push hue on hover for a warmer feel -->
<Story name="Customization / Layer 2: hue shift on hover">
	{#snippet template()}
		<Button variant="primary" style="--button-hover-h: 30; --button-active-h: 60;">
			Hue shift
		</Button>
	{/snippet}
</Story>

<!-- Layer 3: bypass derivation entirely with explicit per-state colors -->
<Story name="Customization / Layer 3: full per-state override">
	{#snippet template()}
		<Button
			variant="primary"
			style="--button-hover-background: oklch(0.7 0.2 30); --button-active-background: oklch(0.5 0.2 30);"
		>
			Orange on hover
		</Button>
	{/snippet}
</Story>

<!-- ── All variants together ─────────────────────────────────────────────── -->

<Story name="All variants">
	{#snippet template()}
		<ButtonGroup>
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="destructive">Destructive</Button>
		</ButtonGroup>
	{/snippet}
</Story>
