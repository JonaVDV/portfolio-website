<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';
	import Heading from '$components/Heading/Heading.svelte';
	import { Button } from '$components/Button';
	import { Input } from '$components/Form/Input';
	const { Story } = defineMeta({
		title: 'Components/Card',
		component: Card,
		tags: ['autodocs']
	});
</script>

<Story name="Default card">
	{#snippet template()}
		<Card --card-max-width="30em">
			{#snippet header()}
				<Heading level="h3">Card Title</Heading>
				<p>This is a simple card component.</p>
			{/snippet}

			<p>
				Cards are a flexible and extensible content container. They include options for headers and
				footers, a wide variety of content, contextual background colors, and powerful display
				options.
			</p>

			{#snippet action()}
				<Button variant="ghost">Action</Button>
			{/snippet}

			{#snippet footer()}
				<Button variant="primary">Primary action</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- ── Media layout ──────────────────────────────────────────────────────── -->

<!-- Login card: form on the right, decorative panel on the left -->
<Story name="Media / Login">
	{#snippet template()}
		<Card --card-max-width="40em" --card-border-radius="0.5rem">
			{#snippet header()}
				<div style="padding: 2rem 2rem 1rem;">
					<strong style="font-size: 1.25rem;">Welcome back</strong>
					<p style="font-size: 0.875rem; opacity: 0.7; margin-block-start: 0.25rem;">
						Sign in to your account
					</p>
				</div>
			{/snippet}

			<div style="padding: 0 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
				<div class="form-group">
					<label for="email" style="font-size: 0.875rem; margin-block-end: 0.25rem;">Email</label>
					<Input id="email" type="email" placeholder="you@example.com" />
				</div>
				<div class="form-group">
					<div class="flex-group">
						<label for="password" style="font-size: 0.875rem; margin-block-end: 0.25rem;"
							>Password</label
						>
						<Button variant="ghost" size="small">Forgot?</Button>
					</div>
					<Input id="password" type="password" placeholder="Enter your password" />
				</div>
			</div>

			{#snippet footer()}
				<div>
					<Button variant="primary">Sign in</Button>
				</div>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- Product card: image on the left, details on the right -->
<Story name="Media / Product">
	{#snippet template()}
		<Card --card-max-width="28em" --card-padding="0" --card-gap="0" --card-media-width="10em">
			{#snippet media()}
				<div
					style="
						width: 100%;
						height: 100%;
						min-height: 12em;
						background: oklch(0.94 0.02 260);
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 3rem;
					"
				>
					📦
				</div>
			{/snippet}

			{#snippet header()}
				<div style="padding: 1rem 1rem 0.5rem;">
					<strong>Wireless Headphones</strong>
					<p style="font-size: 1.25rem; font-weight: 700; margin-block-start: 0.25rem;">$79.99</p>
				</div>
			{/snippet}

			<p style="padding: 0 1rem; font-size: 0.875rem; opacity: 0.7;">
				Premium sound with 30-hour battery life and active noise cancellation.
			</p>

			{#snippet footer()}
				<div style="padding: 0.75rem 1rem;">
					<Button variant="primary">Add to cart</Button>
				</div>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- ── Subgrid ───────────────────────────────────────────────────────────── -->

<!--
  Pricing cards: subgrid aligns header (plan name), content (feature list),
  and footer (CTA) across cards regardless of how many features each plan has.
  The parent grid sets up the columns; each card opts in with subgrid.
-->
<Story name="Subgrid / Pricing cards">
	{#snippet template()}
		<div
			style="
				display: grid;
				grid-auto-flow: column;
				grid-auto-columns: 1fr;
				max-width: 48em;
				gap: 1rem;
			"
		>
			<Card subgrid>
				{#snippet header()}
					<div style="padding-block-end: 0.5rem;">
						<strong style="font-size: 1.1rem;">Starter</strong>
						<p style="font-size: 1.75rem; font-weight: 700; margin-block-start: 0.25rem;">
							$0<span style="font-size: 0.875rem; font-weight: 400;">/mo</span>
						</p>
					</div>
				{/snippet}

				<ul class="pricing-card-benefits">
					<li>✓ 3 projects</li>
					<li>✓ 1GB storage</li>
					<li>✓ Community support</li>
				</ul>

				{#snippet footer()}
					<div style="margin-block-start: auto;">
						<Button --button-width="100%" variant="outline">Get started</Button>
					</div>
				{/snippet}
			</Card>

			<Card subgrid>
				{#snippet header()}
					<div style="padding-block-end: 0.5rem;">
						<strong style="font-size: 1.1rem;">Pro</strong>
						<p style="font-size: 1.75rem; font-weight: 700; margin-block-start: 0.25rem;">
							$19<span style="font-size: 0.875rem; font-weight: 400;">/mo</span>
						</p>
					</div>
				{/snippet}

				<ul class="pricing-card-benefits">
					<li>✓ Unlimited projects</li>
					<li>✓ 50GB storage</li>
					<li>✓ Priority support</li>
					<li>✓ Custom domain</li>
					<li>✓ Analytics dashboard</li>
				</ul>

				{#snippet footer()}
					<div style="margin-block-start: auto;">
						<Button --button-width="100%" variant="primary">Start free trial</Button>
					</div>
				{/snippet}
			</Card>

			<Card subgrid>
				{#snippet header()}
					<div style="padding-block-end: 0.5rem;">
						<strong style="font-size: 1.1rem;">Enterprise</strong>
						<p style="font-size: 1.75rem; font-weight: 700; margin-block-start: 0.25rem;">Custom</p>
					</div>
				{/snippet}

				<ul class="pricing-card-benefits">
					<li>✓ Unlimited everything</li>
					<li>✓ SSO / SAML</li>
					<li>✓ Dedicated support</li>
					<li>✓ SLA guarantee</li>
					<li>✓ Audit logs</li>
					<li>✓ Custom contracts</li>
					<li>✓ On-prem deployment</li>
				</ul>

				{#snippet footer()}
					<div style="margin-block-start: auto;">
						<Button --button-width="100%" variant="outline">Contact sales</Button>
					</div>
				{/snippet}
			</Card>
		</div>
	{/snippet}
</Story>

<!--
  Blog cards: subgrid aligns the title row and footer row across cards
  even when excerpt length varies significantly between posts.
-->
<Story name="Subgrid / Blog cards">
	{#snippet template()}
		<div
			style="
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				max-width: 56em;
				gap: 1rem;
			"
		>
			<Card subgrid>
				{#snippet header()}
					<strong style="font-size: 1rem; line-height: 1.4;">
						Getting started with container queries
					</strong>
				{/snippet}

				<p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">
					Container queries let components respond to their own size rather than the viewport.
					Here's everything you need to know.
				</p>

				{#snippet footer()}
					<a href={null} style="font-size: 0.875rem; color: oklch(0.5 0.2 290);">Read more →</a>
				{/snippet}
			</Card>

			<Card subgrid>
				{#snippet header()}
					<strong style="font-size: 1rem; line-height: 1.4;">
						Why I replaced my media queries with math
					</strong>
				{/snippet}
				<div class="subgrid-rows">
					<p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">Short post.</p>
				</div>

				{#snippet footer()}
					<a href={null} style="font-size: 0.875rem; color: oklch(0.5 0.2 290);">Read more →</a>
				{/snippet}
			</Card>

			<Card subgrid>
				{#snippet header()}
					<strong style="font-size: 1rem; line-height: 1.4;">
						Subgrid: the feature that makes card layouts actually work
					</strong>
				{/snippet}
				<div class="subgrid-rows">
					<p style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">
						For years, aligning card content across a row required JavaScript hacks or fixed
						heights. Subgrid solves this elegantly — here's a deep dive into how it works and where
						it shines.
					</p>
				</div>

				{#snippet footer()}
					<a href={null} style="font-size: 0.875rem; color: oklch(0.5 0.2 290);">Read more →</a>
				{/snippet}
			</Card>
		</div>
	{/snippet}
</Story>

<!-- ── Customization ─────────────────────────────────────────────────────── -->

<!-- Header border: title row separated from content by a subtle line -->
<Story name="Customization / Header border">
	{#snippet template()}
		<Card
			--card-max-width="24em"
			--card-header-border-bottom="1px solid var(--clr-surface-300, oklch(83% 0.005 315))"
		>
			{#snippet header()}
				<strong>Card title</strong>
			{/snippet}

			<p style="font-size: 0.875rem; line-height: 1.6;">
				The header border provides a clear visual separation without relying on spacing alone.
			</p>
		</Card>
	{/snippet}
</Story>

<!-- Footer border: action row separated from content -->
<Story name="Customization / Footer border">
	{#snippet template()}
		<Card
			--card-max-width="24em"
			--card-footer-border-top="1px solid var(--clr-surface-300, oklch(83% 0.005 315))"
		>
			{#snippet header()}
				<strong>Confirm action</strong>
			{/snippet}

			<p style="font-size: 0.875rem; line-height: 1.6;">
				Are you sure you want to delete this item? This action cannot be undone.
			</p>

			{#snippet footer()}
				<div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
					<Button variant="secondary">Cancel</Button>
					<Button variant="destructive">Delete</Button>
				</div>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- Sectioned card: tinted header + footer with borders, white content area -->
<Story name="Customization / Sectioned">
	{#snippet template()}
		<Card
			--card-max-width="24em"
			--card-header-background="var(--clr-surface-200, oklch(89% 0.003 308))"
			--card-header-border-bottom="1px solid var(--clr-surface-300, oklch(83% 0.005 315))"
			--card-footer-background="var(--clr-surface-200, oklch(89% 0.003 308))"
			--card-footer-border-top="1px solid var(--clr-surface-300, oklch(83% 0.005 315))"
		>
			{#snippet header()}
				<strong>Account settings</strong>
			{/snippet}

			<div style="display: flex; flex-direction: column; gap: 0.75rem;">
				<label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem;">
					Display name
					<Input type="text" placeholder="Your name" />
				</label>
				<label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem;">
					Email
					<Input type="email" placeholder="you@example.com" />
				</label>
			</div>

			{#snippet footer()}
				<div style="display: flex; justify-content: flex-end;">
					<Button variant="primary">Save changes</Button>
				</div>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- Semantic header: brand/accent background for emphasis (e.g. upgrade prompt) -->
<Story name="Customization / Accent header">
	{#snippet template()}
		<Card
			--card-max-width="24em"
			--card-header-background="oklch(0.5 0.2 290)"
			--card-header-color="oklch(0.98 0 0)"
			--card-header-border-bottom="none"
		>
			{#snippet header()}
				<div>
					<strong style="font-size: 1.1rem;">Upgrade to Pro</strong>
					<p style="font-size: 0.8125rem; opacity: 0.8; margin-block-start: 0.25rem;">
						Unlock all features and remove limits.
					</p>
				</div>
			{/snippet}

			<ul
				style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;"
			>
				<li>✓ Unlimited projects</li>
				<li>✓ Priority support</li>
				<li>✓ Advanced analytics</li>
			</ul>

			{#snippet footer()}
				<Button variant="primary">Get started</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<style>
	.pricing-card-benefits {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.5rem;
		font-size: 0.875rem;
		--subgrid-rows: 1;
	}

	.form-group {
		display: grid;
		gap: 0.25rem;
	}
</style>
