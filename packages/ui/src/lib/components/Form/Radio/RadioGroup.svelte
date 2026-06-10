<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	export interface RadioGroupContext {
		readonly name: string;
		value: string | undefined;
	}

	interface Props {
		name: string;
		value?: string;
		children: Snippet;
		class?: ClassValue;
		orientation?: 'horizontal' | 'vertical';
	}

	let {
		name,
		value = $bindable(undefined),
		children,
		class: className,
		orientation = 'vertical'
	}: Props = $props();

	const ctx: RadioGroupContext = {
		get name() {
			return name;
		},
		get value() {
			return value;
		},
		set value(v: string | undefined) {
			value = v;
		}
	};

	setContext('radio-group', ctx);
</script>

<!--
@component RadioGroup

Semantic wrapper for a group of `Radio` inputs. Manages the shared `name` and selected `value` through context, so individual `Radio` items don't need `name` passed manually.

```svelte
<RadioGroup name="color" bind:value={selected}>
  <Radio value="red">Red</Radio>
  <Radio value="blue">Blue</Radio>
</RadioGroup>
```

Also works with a remote form field spread directly on each `Radio`:
```svelte
{#each colors as color}
  <label>
    <input {...form.fields.color.as('radio', color)} />
    {color}
  </label>
{/each}
```
-->

<div class={['radio-group', className]} role="radiogroup" data-orientation={orientation}>
	{@render children()}
</div>

<style>
	.radio-group {
		display: grid;
		gap: var(--radio-group-gap, 0.5rem);

		&[data-orientation='horizontal'] {
			grid-auto-flow: column;
			grid-auto-columns: min-content;
		}
	}
</style>
