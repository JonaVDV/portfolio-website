<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import type { UserEventObject } from 'storybook/test';
	import Combobox from './Combobox.svelte';
	import ComboboxInput from './ComboboxInput.svelte';
	import ComboboxItem from './ComboboxItem.svelte';
	import ComboboxGroup from './ComboboxGroup.svelte';
	import Separator from '$ui/Separator/Separator.svelte';
	import type { Canvas } from 'storybook/internal/csf';
	import { z } from 'zod';
	import { defaults } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { createForm } from '$lib/components/form';

	const FRAMEWORKS = ['Next.js', 'SvelteKit', 'Astro', 'Nuxt.js', 'Remix'];

	const { Story } = defineMeta({
		title: 'Components/Combobox',
		component: Combobox,
		parameters: {
			layout: 'centered',
			// axe violations fail the vitest run instead of only warning in the panel
			a11y: { test: 'error' }
		}
	});

	/** Opens the listbox the way a user would and returns the input. */
	async function openListbox(canvas: Canvas, userEvent: UserEventObject) {
		const input = canvas.getByRole('combobox') as HTMLInputElement;
		await userEvent.click(input);
		await expect(canvas.getByRole('listbox')).toBeVisible();
		return input;
	}

	/** Options still in the a11y tree — filtered-out ones are `hidden`. */
	function visibleOptions(canvas: Canvas) {
		return canvas.queryAllByRole('option');
	}

	const formSchema = z.object({
		framework: z.string().default(''),
		stack: z.array(z.string()).default([])
	});
</script>

<script lang="ts">
	// Seeded the way a load function would, to prove an existing selection renders
	// without the consumer mapping anything.
	const form = createForm(
		() => defaults({ framework: 'SvelteKit', stack: ['Astro', 'Remix'] }, zod4(formSchema)),
		formSchema
	);
	const fields = form.fields;

	/** What the submit handler actually saw, so a test can assert the real payload. */
	let submitted = $state<[string, FormDataEntryValue][]>([]);
</script>

<!-- one markup definition, reused by every story -->
{#snippet flat(multiple = false, disabled: string[] = [])}
	<Combobox items={FRAMEWORKS} label="Framework" {multiple} position="bottom" name="framework">
		{#snippet trigger({ props })}
			<ComboboxInput {...props} />
		{/snippet}

		{#snippet children(items)}
			{#each items as item (item)}
				<ComboboxItem value={item} disabled={disabled.includes(item)}>{item}</ComboboxItem>
			{/each}
		{/snippet}
	</Combobox>
{/snippet}

<Story name="Default">
	{#snippet template()}
		{@render flat()}
	{/snippet}
</Story>

<Story name="Multiple">
	{#snippet template()}
		{@render flat(true)}
	{/snippet}
</Story>

<Story name="Disabled items">
	{#snippet template()}
		{@render flat(false, ['Astro', 'Remix'])}
	{/snippet}
</Story>

<Story name="Grouped">
	{#snippet template()}
		<Combobox items={FRAMEWORKS} label="Framework" position="bottom">
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}

			<ComboboxGroup label="React">
				<ComboboxItem value="Next.js" keywords={['vercel', 'react']}>Next.js</ComboboxItem>
				<ComboboxItem value="Remix" keywords={['react']}>Remix</ComboboxItem>
			</ComboboxGroup>
			<Separator class="full" />
			<ComboboxGroup label="Other">
				<ComboboxItem value="SvelteKit" keywords={['svelte']}>SvelteKit</ComboboxItem>
				<ComboboxItem value="Astro">Astro</ComboboxItem>
				<ComboboxItem value="Nuxt.js" keywords={['vue']}>Nuxt.js</ComboboxItem>
			</ComboboxGroup>
		</Combobox>
	{/snippet}
</Story>

<Story name="Loading">
	{#snippet template()}
		<Combobox items={FRAMEWORKS} label="Framework" position="bottom" loading>
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
		</Combobox>
	{/snippet}
</Story>

<Story name="Custom empty state">
	{#snippet template()}
		<Combobox items={FRAMEWORKS} label="Framework" position="bottom">
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
			{#snippet empty()}
				Nothing here. Try “svelte”.
			{/snippet}
			{#snippet children(items)}
				{#each items as item (item)}
					<ComboboxItem value={item}>{item}</ComboboxItem>
				{/each}
			{/snippet}
		</Combobox>
	{/snippet}
</Story>

<!--
	Bound straight to superforms fields. Note there is no code mapping the selected
	values into FormData: the hidden <select> each Combobox renders is a real form
	control, so `framework` and `stack[]` post themselves.
-->
{#snippet formExample()}
	<form
		data-testid="combobox-form"
		onsubmit={(event) => {
			event.preventDefault();
			submitted = Array.from(new FormData(event.currentTarget).entries());
		}}
	>
		<Combobox
			items={FRAMEWORKS}
			label="Framework"
			position="bottom"
			name={fields.framework.path}
			bind:value={fields.framework.value}
		>
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
			{#snippet children(items)}
				{#each items as item (item)}
					<ComboboxItem value={item}>{item}</ComboboxItem>
				{/each}
			{/snippet}
		</Combobox>

		<Combobox
			items={FRAMEWORKS}
			label="Stack"
			position="bottom"
			multiple
			name={fields.stack.path}
			bind:value={fields.stack.value}
		>
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
			{#snippet children(items)}
				{#each items as item (item)}
					<ComboboxItem value={item}>{item}</ComboboxItem>
				{/each}
			{/snippet}
		</Combobox>

		<pre>
			framework: {JSON.stringify(fields.framework.value)}
			stack: {JSON.stringify(fields.stack.value)}
		</pre>

		<button type="submit">Submit</button>
	</form>
{/snippet}

<Story name="As part of a form">
	{#snippet template()}
		{@render formExample()}
	{/snippet}
</Story>

<Story
	name="Test: posts through superforms without a transform"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const form = canvas.getByTestId('combobox-form') as HTMLFormElement;

		// the values seeded into the form arrive already selected — no loop needed
		await expect(canvas.getByLabelText('Remove Astro')).toBeVisible();
		await expect(canvas.getByLabelText('Remove Remix')).toBeVisible();
		await expect(
			(canvas.getByRole('combobox', { name: 'Framework' }) as HTMLInputElement).value
		).toBe('SvelteKit');

		// and the selection is submittable as-is
		let data = new FormData(form);
		await expect(data.get('framework')).toBe('SvelteKit');
		await expect(data.getAll('stack[]')).toEqual(['Astro', 'Remix']);

		// picking another option updates the field, and so the payload
		const stack = canvas.getByRole('combobox', { name: 'Stack' });
		await userEvent.click(stack);
		await userEvent.click(canvas.getAllByRole('option', { name: /Nuxt\.js/ })[0]);

		await expect(fields.stack.value).toEqual(['Astro', 'Remix', 'Nuxt.js']);
		data = new FormData(form);
		await expect(data.getAll('stack[]')).toEqual(['Astro', 'Remix', 'Nuxt.js']);

		// and deselecting everything then picking two fresh ones still round-trips
		for (const name of ['Astro', 'Remix', 'Nuxt.js']) {
			await userEvent.click(canvas.getByLabelText(`Remove ${name}`));
		}
		await expect(new FormData(form).getAll('stack[]')).toEqual([]);

		await userEvent.click(canvas.getAllByRole('option', { name: /SvelteKit/ })[0]);
		await userEvent.click(canvas.getAllByRole('option', { name: /Astro/ })[0]);
		await expect(new FormData(form).getAll('stack[]')).toEqual(['SvelteKit', 'Astro']);

		// and the same through a real submit, not just reading the form directly
		await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
		await expect(submitted).toEqual([
			['framework', 'SvelteKit'],
			['stack[]', 'SvelteKit'],
			['stack[]', 'Astro']
		]);
	}}
>
	{#snippet template()}
		{@render formExample()}
	{/snippet}
</Story>

<!-- ------------------------------------------------------------------ tests -->

<Story
	name="Test: opens and exposes combobox semantics"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		await expect(input).toHaveAttribute('aria-expanded', 'false');
		await expect(input).toHaveAttribute('aria-autocomplete', 'list');

		await userEvent.click(input);

		await expect(input).toHaveAttribute('aria-expanded', 'true');
		await expect(input).toHaveAttribute('aria-controls');
		await expect(visibleOptions(canvas)).toHaveLength(FRAMEWORKS.length);
	}}
>
	{#snippet template()}
		{@render flat()}
	{/snippet}
</Story>

<Story
	name="Test: keyboard navigates without moving focus"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		input.focus();

		await userEvent.keyboard('{ArrowDown}');
		await expect(input).toHaveAttribute('aria-expanded', 'true');

		await userEvent.keyboard('{ArrowDown}');
		// real focus must stay in the input — that is the whole point of activedescendant
		await expect(document.activeElement).toBe(input);

		const active = input.getAttribute('aria-activedescendant');
		await expect(document.getElementById(active!)).toHaveAttribute('data-highlighted');

		// End jumps to the last option, Home back to the first, and both wrap
		await userEvent.keyboard('{End}');
		await expect(
			document.getElementById(input.getAttribute('aria-activedescendant')!)
		).toHaveTextContent('Remix');
		await userEvent.keyboard('{Home}');
		await expect(
			document.getElementById(input.getAttribute('aria-activedescendant')!)
		).toHaveTextContent('Next.js');
		await userEvent.keyboard('{ArrowUp}');
		await expect(
			document.getElementById(input.getAttribute('aria-activedescendant')!)
		).toHaveTextContent('Remix');
	}}
>
	{#snippet template()}
		{@render flat()}
	{/snippet}
</Story>

<Story
	name="Test: Enter selects and closes"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = (await openListbox(canvas, userEvent)) as HTMLInputElement;

		// the first option is highlighted on open, so one press moves to the second
		await userEvent.keyboard('{ArrowDown}');
		await userEvent.keyboard('{Enter}');

		await expect(input.value).toBe('SvelteKit');
		// single select closes on commit
		await expect(input).toHaveAttribute('aria-expanded', 'false');

		await userEvent.keyboard('{ArrowDown}');
		await expect(input).toHaveAttribute('aria-expanded', 'true');

		// Escape is deliberately not asserted here: the popover's close-on-Escape is
		// a UA behaviour that only runs for trusted input, and userEvent dispatches
		// untrusted events. It works in a real browser; it cannot be reached from a
		// synthetic keypress, so there is nothing here worth asserting.
	}}
>
	{#snippet template()}
		{@render flat()}
	{/snippet}
</Story>

<Story
	name="Test: fuzzy filters and shows the empty state"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = await openListbox(canvas, userEvent);

		// non-contiguous match: "svkt" still scores SvelteKit
		await userEvent.type(input, 'svkt');
		await expect(visibleOptions(canvas)).toHaveLength(1);
		await expect(visibleOptions(canvas)[0]).toHaveTextContent('SvelteKit');

		await userEvent.clear(input);
		await userEvent.type(input, 'zzzz');
		await expect(visibleOptions(canvas)).toHaveLength(0);
		await expect(canvas.getByRole('status')).toHaveTextContent('No items found');
	}}
>
	{#snippet template()}
		{@render flat()}
	{/snippet}
</Story>

<Story
	name="Test: keywords widen the match"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = await openListbox(canvas, userEvent);
		await userEvent.type(input, 'vue');

		// "vue" appears nowhere in "Nuxt.js" — only in its keywords
		await expect(visibleOptions(canvas)).toHaveLength(1);
		await expect(visibleOptions(canvas)[0]).toHaveTextContent('Nuxt.js');
	}}
>
	{#snippet template()}
		<Combobox items={FRAMEWORKS} label="Framework" position="bottom">
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
			<ComboboxItem value="Nuxt.js" keywords={['vue']}>Nuxt.js</ComboboxItem>
			<ComboboxItem value="SvelteKit">SvelteKit</ComboboxItem>
		</Combobox>
	{/snippet}
</Story>

<Story
	name="Test: disabled items are skipped"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = (await openListbox(canvas, userEvent)) as HTMLInputElement;

		const astro = canvas.getByRole('option', { name: /Astro/ });
		await expect(astro).toHaveAttribute('aria-disabled', 'true');

		// clicking a disabled option does nothing
		await userEvent.click(astro);
		await expect(input.value).toBe('');

		// clicking an option must not steal focus, so the keyboard still works after
		await expect(document.activeElement).toBe(input);
		// arrowing steps over the disabled ones: Next.js -> SvelteKit -> Nuxt.js
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expect(
			document.getElementById(input.getAttribute('aria-activedescendant')!)
		).toHaveTextContent('Nuxt.js');
	}}
>
	{#snippet template()}
		{@render flat(false, ['Astro', 'Remix'])}
	{/snippet}
</Story>

<Story
	name="Test: multiple selection with chips"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = (await openListbox(canvas, userEvent)) as HTMLInputElement;
		await expect(canvas.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');

		await userEvent.type(input, 'sv');
		await userEvent.keyboard('{Enter}');
		// the chip takes over, so the query resets and the list stays open
		await expect(input.value).toBe('');
		await expect(input).toHaveAttribute('aria-expanded', 'true');
		await expect(canvas.getByLabelText('Remove SvelteKit')).toBeVisible();

		await userEvent.click(canvas.getByRole('option', { name: /Astro/ }));
		await expect(canvas.getByLabelText('Remove Astro')).toBeVisible();

		// re-clicking a selected option toggles it back off
		await userEvent.click(canvas.getByRole('option', { name: /Astro/ }));
		await expect(canvas.queryByLabelText('Remove Astro')).toBeNull();

		// the chip's own button removes it
		await userEvent.click(canvas.getByLabelText('Remove SvelteKit'));
		await expect(canvas.queryByLabelText('Remove SvelteKit')).toBeNull();
	}}
>
	{#snippet template()}
		{@render flat(true)}
	{/snippet}
</Story>

<Story
	name="Test: backspace removes the last chip"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = (await openListbox(canvas, userEvent)) as HTMLInputElement;
		await userEvent.click(canvas.getByRole('option', { name: /SvelteKit/ }));
		await userEvent.click(canvas.getByRole('option', { name: /Astro/ }));

		input.focus();
		await userEvent.type(input, 'x');
		// with a query present backspace edits text, it does not eat a chip
		await userEvent.keyboard('{Backspace}');
		await expect(canvas.getByLabelText('Remove Astro')).toBeVisible();

		await userEvent.keyboard('{Backspace}');
		await expect(canvas.queryByLabelText('Remove Astro')).toBeNull();
		await expect(canvas.getByLabelText('Remove SvelteKit')).toBeVisible();
	}}
>
	{#snippet template()}
		{@render flat(true)}
	{/snippet}
</Story>

<Story
	name="Test: groups hide when empty"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		const input = await openListbox(canvas, userEvent);
		await expect(canvas.getAllByRole('group')).toHaveLength(2);

		await userEvent.type(input, 'react');
		// only the React group has items matching that keyword
		await expect(canvas.getAllByRole('group')).toHaveLength(1);
		await expect(canvas.getByRole('group')).toHaveAccessibleName('React');
	}}
>
	{#snippet template()}
		<Combobox items={FRAMEWORKS} label="Framework" position="bottom">
			{#snippet trigger({ props })}
				<ComboboxInput {...props} />
			{/snippet}
			<ComboboxGroup label="React">
				<ComboboxItem value="Next.js" keywords={['react']}>Next.js</ComboboxItem>
				<ComboboxItem value="Remix" keywords={['react']}>Remix</ComboboxItem>
			</ComboboxGroup>
			<ComboboxGroup label="Other">
				<ComboboxItem value="Astro">Astro</ComboboxItem>
			</ComboboxGroup>
		</Combobox>
	{/snippet}
</Story>

<Story
	name="Test: submits through the hidden select"
	tags={['!dev']}
	play={async ({ canvas, userEvent }) => {
		await openListbox(canvas, userEvent);
		await userEvent.click(canvas.getByRole('option', { name: /Astro/ }));

		const form = canvas.getByTestId('combobox-form') as HTMLFormElement;
		await expect(new FormData(form).get('framework')).toBe('Astro');
	}}
>
	{#snippet template()}
		<form data-testid="combobox-form">
			{@render flat()}
		</form>
	{/snippet}
</Story>
