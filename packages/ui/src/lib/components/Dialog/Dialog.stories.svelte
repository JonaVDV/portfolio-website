<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dialog from './Dialog.svelte';
	import Button from '../Button/Button.svelte';
	import UserPlus from '~icons/lucide/user-plus';
	import Trash from '~icons/lucide/trash-2';
	import { Input } from '$components/Form/Input';
	import Label from '$components/Form/Label/Label.svelte';

	const { Story } = defineMeta({
		title: 'Components/Dialog',
		component: Dialog,
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			lightDismiss: { control: 'boolean' },
			closeButton: { control: 'boolean' }
		},
		args: {
			closeButton: true,
			lightDismiss: true
		}
	});
</script>

<Story name="Standard Content">
	{#snippet template(args)}
		<Dialog {...args}>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps}>Open Standard Dialog</Button>
			{/snippet}

			{#snippet header()}
				<h2 style="font-size: var(--fs-600); font-weight: var(--fw-bold);">Project Overview</h2>
				<p style="color: var(--clr-brand-400); font-size: var(--fs-300);">
					Review the latest analysis results.
				</p>
			{/snippet}

			<div style="display: grid; gap: 1rem;">
				<p>This is a standard dialog with a header snippet and built-in close button.</p>
				<p>It uses the default themeable variables for padding and layout.</p>
			</div>

			{#snippet footer()}
				<Button variant="ghost">Cancel</Button>
				<Button variant="primary">Accept Changes</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Production Example: User Invitation" args={{ closeButton: true }}>
	{#snippet template(args)}
		<Dialog
			{...args}
			style="
				--dialog-header-background: var(--clr-brand-50, #f0f9ff);
				--dialog-header-border-bottom: 1px solid var(--clr-brand-100);
				--dialog-footer-background: var(--clr-surface-50, #fafafa);
				--dialog-footer-border-top: 1px solid var(--clr-surface-200);
				--dialog-max-width: 35rem;
			"
		>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="primary">
					Invite Member
					<UserPlus />
				</Button>
			{/snippet}

			{#snippet header()}
				<div style="display: flex; gap: 1rem; align-items: center;">
					<div
						style="background: white; padding: 0.5rem; border-radius: 8px; border: 1px solid var(--clr-brand-200);"
					>
						<UserPlus style="color: var(--clr-brand-500);" />
					</div>
					<div>
						<h2 style="font-size: var(--fs-500); font-weight: var(--fw-bold); margin: 0;">
							Invite Team Member
						</h2>
						<p style="margin: 0; font-size: var(--fs-200); opacity: 0.7;">
							Send an invitation to join your workspace.
						</p>
					</div>
				</div>
			{/snippet}

			<div style="display: grid; gap: 1.5rem;">
				<div style="display: grid; gap: 0.5rem;">
					<Label for="email">Email Address</Label>
					<Input type="email" id="email" placeholder="" />
				</div>
				<div style="display: grid; gap: 0.5rem;">
					<label style="font-weight: var(--fw-bold); font-size: var(--fs-200);">Role</label>
					<select
						style="width: 100%; padding: 0.75rem; border: 1px solid var(--clr-surface-300); border-radius: 6px;"
					>
						<option>Editor</option>
						<option>Viewer</option>
						<option>Admin</option>
					</select>
				</div>
			</div>

			{#snippet footer()}
				<Button variant="ghost">Cancel</Button>
				<Button variant="primary">Send Invitation</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Production Example: Destructive Action" args={{ lightDismiss: false }}>
	{#snippet template(args)}
		<Dialog
			{...args}
			style="
				--dialog-padding: 2rem;
				--dialog-border-color: var(--clr-danger-200);
				--dialog-footer-justify: stretch;
				--dialog-footer-gap: 1rem;
			"
		>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="danger">
					Delete Project
					<Trash />
				</Button>
			{/snippet}

			{#snippet header()}
				<div style="text-align: center;">
					<div
						style="background: var(--clr-danger-50); width: 3rem; height: 3rem; border-radius: 50%; display: grid; place-items: center; margin: 0 auto 1rem;"
					>
						<Trash style="color: var(--clr-danger-600);" />
					</div>
					<h2 style="font-size: var(--fs-600); font-weight: var(--fw-bold);">
						Are you absolutely sure?
					</h2>
				</div>
			{/snippet}

			<div style="text-align: center; color: var(--clr-surface-600);">
				<p>
					This action cannot be undone. This will permanently delete the <strong
						>"Internal Audit Q4"</strong
					> project and all associated analysis data.
				</p>
			</div>

			{#snippet footer()}
				<Button variant="ghost" style="flex: 1;">Keep Project</Button>
				<Button variant="danger" style="flex: 1;">Delete Permanently</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Custom Layout: Centered Footer">
	{#snippet template(args)}
		<Dialog
			{...args}
			style="
				--dialog-footer-justify: center;
				--dialog-footer-gap: 2rem;
				--dialog-padding: 2rem;
			"
		>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="secondary">Centered Layout</Button>
			{/snippet}

			{#snippet header()}
				<div style="text-align: center; width: 100%;">
					<h2 style="font-size: var(--fs-600); font-weight: var(--fw-bold);">Preference Updated</h2>
				</div>
			{/snippet}

			<div style="text-align: center;">
				<p>Your workspace preferences have been saved successfully.</p>
			</div>

			{#snippet footer()}
				<Button variant="primary">Dismiss</Button>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>

<Story name="Full Width Headers">
	{#snippet template(args)}
		<Dialog
			{...args}
			style="
				--dialog-header-background: linear-gradient(135deg, var(--clr-brand-600), var(--clr-brand-400));
				--dialog-header-color: white;
				--dialog-header-padding: 3rem 1.5rem;
				--dialog-content-background: var(--clr-surface-50);
			"
		>
			{#snippet trigger({ triggerProps })}
				<Button {...triggerProps} variant="ghost">Gradient Header</Button>
			{/snippet}

			{#snippet header()}
				<div>
					<h2 style="font-size: var(--fs-700); font-weight: var(--fw-bold); margin: 0;">
						What's New?
					</h2>
					<p style="opacity: 0.9; margin: 0.5rem 0 0;">Version 2.4 is officially here.</p>
				</div>
			{/snippet}

			<div style="display: grid; gap: 1rem;">
				<div
					style="padding: 1rem; background: white; border-radius: 8px; border: 1px solid var(--clr-surface-200);"
				>
					<h4 style="font-weight: var(--fw-bold);">New AI Models</h4>
					<p style="font-size: var(--fs-200);">Support for Claude 3.5 and Gemini Pro 1.5.</p>
				</div>
				<div
					style="padding: 1rem; background: white; border-radius: 8px; border: 1px solid var(--clr-surface-200);"
				>
					<h4 style="font-weight: var(--fw-bold);">Advanced Filtering</h4>
					<p style="font-size: var(--fs-200);">Filter team members by skill overlap scores.</p>
				</div>
			</div>

			{#snippet footer()}
				<form action="" method="dialog">
					<Button variant="primary">Awesome!</Button>
				</form>
			{/snippet}
		</Dialog>
	{/snippet}
</Story>
