<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

	let { children, ...rest }: TableHeaderProps = $props();
</script>

<thead {...rest}>
	<tr>
		{@render children?.()}
	</tr>
</thead>
