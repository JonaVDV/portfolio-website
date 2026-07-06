<script lang="ts">
	import Avatar from '$components/Avatar/Avatar.svelte';
</script>

<Avatar alt="Shadcn" src="https://github.com/shadcn.pngt">
	{#snippet fallback()}
		CN
	{/snippet}
</Avatar>
