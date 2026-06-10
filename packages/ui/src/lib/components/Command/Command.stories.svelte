<script lang="ts" module>
	import Command from './Command.svelte';
	import CommandInput from './CommandInput.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CommandItem from './CommandItem.svelte';
	import CalendarIcon from '~icons/lucide/calendar';
	import EmojiIcon from '~icons/lucide/smile';
	import ProfileIcon from '~icons/lucide/user';
	import CreditCardIcon from '~icons/lucide/credit-card';
	import SettingsIcon from '~icons/lucide/settings';
	import CalculatorIcon from '~icons/lucide/calculator';
	import Kbd from '$components/Kbd/Kbd.svelte';
	import { cmd } from '$lib/components/Kbd/Kbd.svelte';
	import CommandGroup from './CommandGroup.svelte';
	import Separator from '$components/Separator/Separator.svelte';
	import CommandDialog from './CommandDialog.svelte';

	const { Story } = defineMeta({
		title: 'Components/Command',
		component: Command
	});
</script>

<Story name="Default">
	{#snippet template()}
		<CommandDialog>
			{#snippet trigger(props)}
				<button onclick={props.openFn}>
					Open Command Palette <Kbd>{cmd} + K</Kbd>
				</button>
			{/snippet}
			<Command>
				<CommandInput placeholder="Type a command or search..." />
				<div role="listbox">
					<CommandGroup label="Suggestions">
						<CommandItem>
							<CalendarIcon />
							<span> Calendar </span>
						</CommandItem>
						<CommandItem>
							<EmojiIcon />
							<span> Search Emoji </span>
						</CommandItem>
						<CommandItem>
							<CalculatorIcon />
							<span> Calculator </span>
						</CommandItem>
					</CommandGroup>
					<Separator />
					<CommandGroup label="Settings">
						<CommandItem>
							<ProfileIcon />
							<span> Profile </span>
						</CommandItem>
						<CommandItem>
							<CreditCardIcon />
							<span> Billing </span>
						</CommandItem>
						<CommandItem>
							<SettingsIcon />
							<span> Settings </span>
						</CommandItem>
					</CommandGroup>
				</div>
			</Command>
		</CommandDialog>
	{/snippet}
</Story>
