<script lang="ts" generics="TForm extends RemoteForm<any, any>, TName extends FieldNames<TForm>">
	import type { Snippet } from 'svelte';
	import type {
		RemoteForm,
		RemoteFormInput,
		RemoteFormField,
		RemoteFormFieldValue
	} from '@sveltejs/kit';

	// Extract only the actual field names from the schema input type
	type FieldNames<T> =
		T extends RemoteForm<infer Input, any>
			? Input extends RemoteFormInput
				? keyof Input & string
				: never
			: never;

	// Get the field type for a specific field name
	type FieldType<T, N extends string> =
		T extends RemoteForm<infer Input, any>
			? Input extends RemoteFormInput
				? N extends keyof Input
					? Input[N] extends RemoteFormFieldValue
						? RemoteFormField<Input[N]>
						: never
					: never
				: never
			: never;

	type Props<TForm extends RemoteForm<any, any>, TName extends FieldNames<TForm>> = {
		form: TForm;
		label: string;
		name: TName;
		children: Snippet<[field: FieldType<TForm, TName>]>;
	};

	let { form, label, name, children }: Props<TForm, TName> = $props();
</script>

<div class="form-group">
	<label for={name}>
		{label}
	</label>

	{@render children(form.fields[name] as FieldType<TForm, TName>)}
</div>

<style lang="scss">
	@use '../../styles/abstracts/' as *;

	.form-group {
		display: grid;
		gap: var(--form-group-gap, 0.5rem);
	}
</style>
