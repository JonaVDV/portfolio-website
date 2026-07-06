<script lang="ts" module>
	import { Button } from '$components/Button';
	import * as Dropdown from '$components/DropdownMenu';
	import ButtonGroup from './ButtonGroup.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Button Group',
		component: ButtonGroup,
		parameters: {
			layout: 'centered'
		},
		tags: ['autodocs']
	});
</script>

<Story name="Default">
	{#snippet template()}
		<ButtonGroup>
			<Button variant="outline">like</Button>
			<Button variant="outline">subscribe</Button>

			<Dropdown.Root>
				{#snippet trigger({ props })}
					<Button {...props} variant="outline">share</Button>
				{/snippet}
				<Dropdown.Group label="Share to">
					<Dropdown.Item>Facebook</Dropdown.Item>
					<Dropdown.Item>Twitter</Dropdown.Item>
					<Dropdown.Item>LinkedIn</Dropdown.Item>
				</Dropdown.Group>
			</Dropdown.Root>
		</ButtonGroup>
	{/snippet}
</Story>
