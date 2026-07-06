<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AlertDialog from './AlertDialog.svelte';
	import Button from '$components/Button/Button.svelte';

	const { Story } = defineMeta({
		component: AlertDialog,
		tags: ['autodocs'],
		title: 'Components/Dialog/AlertDialog'
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<AlertDialog
			title="Are you absolutely sure?"
			description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
		>
			{#snippet trigger({ triggerProps })}
				<Button variant="outline" {...triggerProps}>Delete Account</Button>
			{/snippet}

			{#snippet action()}
				<Button
					variant="outline"
					--button-border-color="oklch(0.6 0.2 25)"
					--button-color="oklch(0.6 0.2 25)"
				>
					Continue
				</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>

<Story name="Destructive Action">
	{#snippet template(args)}
		<AlertDialog
			title="Revoke access?"
			description="The user will no longer be able to access this resource."
		>
			{#snippet trigger({ triggerProps })}
				<Button variant="outline" {...triggerProps}>Revoke Access</Button>
			{/snippet}

			{#snippet action()}
				<Button variant="outline" --button-background="oklch(0.6 0.2 25)" --button-color="white">
					Revoke
				</Button>
			{/snippet}
		</AlertDialog>
	{/snippet}
</Story>
