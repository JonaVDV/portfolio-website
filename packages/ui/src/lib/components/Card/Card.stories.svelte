<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card } from '$components/Card';
	import { Heading } from '$components/Heading';
	import { Button } from '$components/Button';

	const { Story } = defineMeta({
		title: 'Components/Card',
		parameters: {
			layout: 'centered',
			controls: { expanded: true }
		},
		component: Card,
		tags: ['autodocs'],
		args: {
			'--card-max-width': '30rem',
			'--card-header-background': 'transparent',
			'--card-footer-background': 'transparent'
		},
		argTypes: {
			'--card-max-width': {
				control: { type: 'text' },
				description: 'CSS variable to set the maximum width of the card.',
				table: {
					type: { summary: 'string' },
					defaultValue: { summary: '30rem' }
				}
			},
			'--card-header-background': {
				control: { type: 'color' },
				description:
					'CSS variable to set the background color of the card header. If not set, defaults to transparent.',
				table: {
					type: { summary: 'string' },
					defaultValue: { summary: 'transparent' }
				}
			},
			'--card-footer-background': {
				control: { type: 'color' },
				description:
					'CSS variable to set the background color of the card footer. If not set, defaults to transparent.',
				table: {
					type: { summary: 'string' },
					defaultValue: { summary: 'transparent' }
				}
			}
		}
	});

	const IMG = 'https://picsum.photos/600/300';
</script>

<!-- ── Structure ─────────────────────────────────────────────────────────── -->

<Story name="Full (header + body + footer)">
	{#snippet template(args)}
		<Card
			--card-max-width={args['--card-max-width']}
			--card-header-background={args['--card-header-background']}
			--card-footer-background={args['--card-footer-background']}
		>
			{#snippet header()}
				<Heading level="h2">Card Header</Heading>
				<p class="subtitle">Card subtitle</p>
			{/snippet}

			<p>This is the body of the card. It can contain any content you want.</p>

			{#snippet footer()}
				<Button variant="primary">Save</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<Story name="Without header">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			<p>This is the body of the card. It can contain any content you want.</p>

			{#snippet footer()}
				<Button variant="primary">Save</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<Story name="Without footer">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			{#snippet header()}
				<Heading level="h2">Card Header</Heading>
				<p class="subtitle">Card subtitle</p>
			{/snippet}

			<p>This is the body of the card. It can contain any content you want.</p>
		</Card>
	{/snippet}
</Story>

<Story name="Body only">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			<p>This is the body of the card. It can contain any content you want.</p>
		</Card>
	{/snippet}
</Story>

<!-- ── Action ────────────────────────────────────────────────────────────── -->

<!-- Action pins to the header's top-inline-end, aligned with the title. -->
<Story name="Action (short title)">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			{#snippet header()}
				<Heading level="h2">Settings</Heading>
				<p class="subtitle">Manage your preferences</p>
			{/snippet}

			{#snippet action()}
				<Button variant="ghost">Edit</Button>
			{/snippet}

			<p>The action stays out of the grid flow, so it never shifts the title.</p>
		</Card>
	{/snippet}
</Story>

<!-- The action floats, so a long title reserves space and wraps around it. -->
<Story name="Action (long title — wrap check)">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			{#snippet header()}
				<Heading level="h2">A deliberately long card title that keeps going</Heading>
				<p class="subtitle">Watch how the title flows relative to the action</p>
			{/snippet}

			{#snippet action()}
				<Button variant="ghost">Edit</Button>
			{/snippet}

			<p>The floated action reserves space; the long title wraps to the next line.</p>
		</Card>
	{/snippet}
</Story>

<!-- ── Media ─────────────────────────────────────────────────────────────── -->

<!-- Image dropped straight into the body: bleeds to the edges via subgrid. -->
<Story name="Body media">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			{#snippet header()}
				<Heading level="h2">Card Header</Heading>
			{/snippet}

			<img src={IMG} alt="Placeholder" />

			<p>Body text sits in the content track; the image breaks out to full width.</p>
		</Card>
	{/snippet}
</Story>

<!-- Image as the first child of a headerless card: flush to the very top. -->
<Story name="Top media (flush)">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			<img src={IMG} alt="Placeholder" />

			<p>No header, so the first-child image sits flush against the card's top edge.</p>

			{#snippet footer()}
				<Button variant="primary">Save</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<!-- Image above the title: zero the header padding so the image fills it, then
pad the title text itself. Header/footer aren't subgrid — this is the hook. -->
<Story name="Header media (above title)">
	{#snippet template(args)}
		<Card
			--card-max-width={args['--card-max-width']}
			--card-header-padding={args['--card-header-padding']}
		>
			{#snippet header()}
				<img src={IMG} alt="Placeholder" />
				<Heading level="h2">Card Header</Heading>
				<p class="subtitle">Card subtitle</p>
			{/snippet}

			<p>The header padding is zeroed, so the image fills it edge-to-edge.</p>
		</Card>
	{/snippet}
</Story>

<Story name="Header media with action">
	{#snippet template(args)}
		<Card
			--card-max-width={args['--card-max-width']}
			--card-header-padding={args['--card-header-padding']}
		>
			{#snippet header()}
				<div class="grid-stack" data-card-full>
					<img src={IMG} alt="Placeholder" data-card-full />
					<!-- place button top right with grid area -->
					<Button style="place-self: start end;" data-card-full variant="ghost">Edit</Button>

					<div
						data-card-full
						style="place-self: end start; background: rgba(0, 0, 0, 0.5); padding: 1rem; color: white;"
					>
						<Heading --heading-color="white" level="h2">Card Header</Heading>
						<p style="--subtitle-color:white" class="subtitle">Card subtitle</p>
					</div>
				</div>
			{/snippet}

			<p>
				Sometimes you want an image with an action overlay. In this case grid-stack comes to the
				rescue.
			</p>
		</Card>
	{/snippet}
</Story>

<!-- Hero: zero the header padding and let a grid-stack overlay text on the image. -->
<Story name="Hero (grid-stack overlay)">
	{#snippet template()}
		<Card --card-max-width="30rem" --card-header-padding="0">
			{#snippet header()}
				<div class="grid-stack">
					<img src={IMG} alt="Placeholder" />
					<div style="place-self: end start; padding: 1rem; color: white;">
						<Heading level="h2">Overlaid title</Heading>
						<p class="subtitle" style="color: inherit;">Text stacked on the image</p>
					</div>
				</div>
			{/snippet}

			<p>The header is a grid-stack, so the image and text share one grid area.</p>
		</Card>
	{/snippet}
</Story>

<!-- ── Breakout without media ────────────────────────────────────────────── -->

<!-- .full spans full width but keeps normal spacing (unlike edge media). -->
<Story name="Full-width divider">
	{#snippet template(args)}
		<Card --card-max-width={args['--card-max-width']}>
			{#snippet header()}
				<Heading level="h2">Card Header</Heading>
			{/snippet}

			<p>Content above the divider.</p>
			<hr class="full" />
			<p>Content below the divider — the rule reaches both card edges.</p>
		</Card>
	{/snippet}
</Story>

<!-- ── Customisation ─────────────────────────────────────────────────────── -->

<Story name="Tinted header + footer">
	{#snippet template(args)}
		<Card
			--card-max-width={args['--card-max-width']}
			--card-header-background="var(--clr-surface-500, #eee)"
			--card-footer-background="var(--clr-surface-500, #eee)"
		>
			{#snippet header()}
				<Heading level="h2">Account</Heading>
				<p class="subtitle">Sectioned card with tinted bands</p>
			{/snippet}

			<p>The header and footer backgrounds bleed edge-to-edge; text stays inset.</p>

			{#snippet footer()}
				<Button variant="primary">Save changes</Button>
			{/snippet}
		</Card>
	{/snippet}
</Story>
