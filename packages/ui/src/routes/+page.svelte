<script lang="ts">
	import Dialog from '$components/Dialog/Dialog.svelte';
	import Checkbox from '$components/Form/Checkbox.svelte';
	import Field from '$components/Form/Field.svelte';
	import Heading from '$components/Heading/Heading.svelte';
	import { testForm } from '$lib/test.remote';
	import type { RemoteForm, RemoteFormInput, RemoteFormFields } from '@sveltejs/kit';
	import { z } from 'zod';

	const schema = z.object({
		name: z.string().min(2).max(100),
		email: z.email({ error: 'Invalid email address' }),
		message: z.string().min(10).max(1000)
	});

	testForm.fields.name;
</script>

<form {...testForm}>
	<Field label="Name" form={testForm} name="name">
		{#snippet children(field)}
			<input {...field.as('email')} />
		{/snippet}
	</Field>
	<Field label="Email" form={testForm} name="email">
		{#snippet children(field)}
			<input {...field.as('email')} />
		{/snippet}
	</Field>
	<Field label="Message" form={testForm} name="message">
		{#snippet children(field)}
			<textarea {...field.as('text')}></textarea>
		{/snippet}
	</Field>
	<button type="submit">Submit</button>
</form>

<Checkbox></Checkbox>
