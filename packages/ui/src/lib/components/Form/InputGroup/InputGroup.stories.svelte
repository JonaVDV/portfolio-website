<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import InputGroup from './InputGroup.svelte';
	import Textarea from '../Textarea.svelte';
	import InputGroupAddon from './InputGroupAddon.svelte';
	import Input from '../Input.svelte';
	import SearchIcon from '~icons/lucide/search';
	import InfoIcon from '~icons/lucide/info';
	import Tooltip from '$components/Tooltip/Tooltip.svelte';
	import Button from '$components/Button/Button.svelte';
	import ArrowUpIcon from '~icons/lucide/arrow-up';
	import Separator from '$components/Separator/Separator.svelte';
	import PlusIcon from '~icons/lucide/plus';
	import { Dropdown } from '$components/DropdownMenu';

	const { Story } = defineMeta({
		title: 'Components/Form/InputGroup',
		component: InputGroup,
		tags: ['autodocs']
	});
</script>

<Story name="With addon">
	{#snippet template()}
		<div class="primary-layout">
			<div>
				<InputGroup>
					<Input placeholder="Search..." />
					<InputGroupAddon align="inline-start">
						<SearchIcon />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">
						<span> 12 results </span>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup>
					<Input placeholder="Search..." />
					<InputGroupAddon align="inline-start">
						<span> https:// </span>
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">
						<Tooltip
							content="This is some tooltip content"
							position="top"
							--popover-custom-fallbacks="none"
						>
							{#snippet trigger({ props })}
								<Button variant="stripped" {...props}>
									<InfoIcon />
								</Button>
							{/snippet}
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup>
					<Textarea placeholder="Ask, Search, or Chat..." />
					<InputGroupAddon align="block-end">
						<div class="flex-group space-between">
							<div>
								<Button --button-padding=".25rem" --button-border-radius="50%" variant="primary"
									><PlusIcon /></Button
								>
								<Dropdown.Root>
									{#snippet trigger({ props })}
										<Button variant="stripped" {...props}>Auto</Button>
									{/snippet}
									<Dropdown.Item>Option 1</Dropdown.Item>
									<Dropdown.Item>Option 2</Dropdown.Item>
									<Dropdown.Item>Option 3</Dropdown.Item>
								</Dropdown.Root>
							</div>
							<div
								style="display: inline-grid; grid-auto-flow: column; align-items: center; gap: 0.5rem;"
							>
								<span> 52% used </span>
								<Separator orientation="vertical" />
								<Button --button-padding=".25rem" --button-border-radius="50%" variant="primary"
									><ArrowUpIcon /></Button
								>
							</div>
						</div>
					</InputGroupAddon>
				</InputGroup>
			</div>
		</div>
	{/snippet}
</Story>
