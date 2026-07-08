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
	import { cmd } from '$components/Kbd/Kbd.svelte';
	import CommandGroup from './CommandGroup.svelte';
	import Separator from '$components/Separator/Separator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Command',
		component: Command
	});
</script>

<Story name="Default">
	{#snippet template()}
		<Command>
			<CommandInput placeholder="Type a command or search..." />
			<CommandGroup label="Suggestions">
				<CommandItem value="calendar">
					<CalendarIcon />
					<span> Calendar </span>
				</CommandItem>
				<CommandItem value="search-emoji">
					<EmojiIcon />
					<span> Search Emoji </span>
				</CommandItem>
				<CommandItem value="calculator">
					<CalculatorIcon />
					<span> Calculator </span>
				</CommandItem>
			</CommandGroup>
			<Separator />
			<CommandGroup label="Settings">
				<CommandItem value="profile">
					<ProfileIcon />
					<span> Profile </span>
				</CommandItem>
				<CommandItem value="billing">
					<CreditCardIcon />
					<span> Billing </span>
				</CommandItem>
				<CommandItem value="settings" href="/settings">
					<SettingsIcon />
					<span> Settings </span>
					<Kbd
						--kbd-background="transparent"
						--kbd-color="currentColor"
						--kbd-font-size="0.8em"
						style="margin-inline-start: auto;"
						class="">{cmd} + S</Kbd
					>
				</CommandItem>
			</CommandGroup>
		</Command>
	{/snippet}
</Story>
